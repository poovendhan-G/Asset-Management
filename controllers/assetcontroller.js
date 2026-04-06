const Asset = require('../models/asset');
const AssetLog = require('../models/assetLog');
const Employee = require('../models/employee');

function isWebForm(req) {
    return req.body && req.body._from === 'web';
}

function stripFormMeta(body) {
    if (!body) return {};
    const { _from, ...rest } = body;
    return rest;
}

exports.assetsPage = async (req, res) => {
    try {
        const assets = await Asset.findAll({ order: [['id', 'ASC']] });
        const employees = await Employee.findAll({ order: [['id', 'ASC']] });
        res.render('assets', {
            assets,
            employees,
            notice: req.query.notice,
            error: req.query.error,
        });
    } catch (err) {
        res.status(500).render('assets', {
            assets: [],
            employees: [],
            notice: null,
            error: err.message,
        });
    }
};

exports.getAssetHistoryPage = async (req, res) => {
    const assetId = parseInt(req.params.id, 10);

    try {
        const asset = await Asset.findByPk(assetId);
        const logs = asset
            ? await AssetLog.findAll({
                  where: { assetId },
                  order: [['id', 'DESC']],
              })
            : [];
        res.render('asset-history', { asset, logs });
    } catch (err) {
        res.status(500).render('asset-history', {
            asset: null,
            logs: [],
        });
    }
};

exports.addAsset = async (req, res) => {
    try {
        const payload = stripFormMeta(req.body);
        const created = await Asset.create(payload);
        if (isWebForm(req)) {
            return res.redirect('/assets/ui?notice=' + encodeURIComponent('Asset added.'));
        }
        res.json(created);
    } catch (err) {
        if (isWebForm(req)) {
            return res.redirect('/assets/ui?error=' + encodeURIComponent(err.message));
        }
        res.status(500).json({ message: err.message });
    }
};

exports.getAssetHistory = async (req, res) => {
    const assetId = parseInt(req.params.id, 10);

    try {
        const rows = await AssetLog.findAll({
            where: { assetId },
            order: [['id', 'DESC']],
        });
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAssets = async (req, res) => {
    try {
        const data = await Asset.findAll();
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.issueAsset = async (req, res) => {
    const assetId = parseInt(req.body.assetId, 10);
    const employeeId = parseInt(req.body.employeeId, 10);

    try {
        const asset = await Asset.findByPk(assetId);

        if (!asset) {
            if (isWebForm(req)) {
                return res.redirect('/assets/ui?error=' + encodeURIComponent('Asset not found'));
            }
            return res.status(404).json({ msg: 'Asset not found' });
        }

        if (asset.status === 'issued') {
            if (isWebForm(req)) {
                return res.redirect('/assets/ui?notice=' + encodeURIComponent('That asset is already issued.'));
            }
            return res.json({ msg: 'Already issued' });
        }

        asset.status = 'issued';
        await asset.save();

        await AssetLog.create({
            assetId,
            employeeId,
            action: 'issued',
        });

        if (isWebForm(req)) {
            return res.redirect('/assets/ui?notice=' + encodeURIComponent('Asset issued.'));
        }
        res.json({ msg: 'Asset issued successfully' });
    } catch (err) {
        if (isWebForm(req)) {
            return res.redirect('/assets/ui?error=' + encodeURIComponent(err.message));
        }
        res.status(500).json({ message: err.message });
    }
};

exports.returnAsset = async (req, res) => {
    const assetId = parseInt(req.body.assetId, 10);

    try {
        const asset = await Asset.findByPk(assetId);

        if (!asset) {
            if (isWebForm(req)) {
                return res.redirect('/assets/ui?error=' + encodeURIComponent('Asset not found'));
            }
            return res.status(404).json({ msg: 'Asset not found' });
        }

        asset.status = 'available';
        await asset.save();

        await AssetLog.create({
            assetId,
            employeeId: null,
            action: 'returned',
        });

        if (isWebForm(req)) {
            return res.redirect('/assets/ui?notice=' + encodeURIComponent('Asset returned.'));
        }
        res.json({ msg: 'Asset returned successfully' });
    } catch (err) {
        if (isWebForm(req)) {
            return res.redirect('/assets/ui?error=' + encodeURIComponent(err.message));
        }
        res.status(500).json({ message: err.message });
    }
};
