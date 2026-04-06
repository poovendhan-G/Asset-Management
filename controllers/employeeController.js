const Employee = require('../models/employee');

function isWebForm(req) {
    return req.body && req.body._from === 'web';
}

function stripFormMeta(body) {
    if (!body) return {};
    const { _from, ...rest } = body;
    return rest;
}

exports.createEmployee = async (req, res) => {
    try {
        const payload = stripFormMeta(req.body);
        const created = await Employee.create(payload);
        if (isWebForm(req)) {
            return res.redirect('/employees/view?notice=' + encodeURIComponent('Employee added.'));
        }
        res.status(201).json(created);
    } catch (err) {
        if (isWebForm(req)) {
            return res.redirect('/employees/view?error=' + encodeURIComponent(err.message));
        }
        res.status(500).json({ message: err.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll({ order: [['id', 'ASC']] });
        if (req.path === '/view' || req.path.endsWith('/view')) {
            return res.render('employees', {
                employees,
                notice: req.query.notice,
                error: req.query.error,
            });
        }
        res.json(employees);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
