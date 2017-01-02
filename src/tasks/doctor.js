const gutil = require('gulp-util');
const Doctor = require('../util/doctor');

module.exports = function(config, callback) {
    const dir = process.env.INIT_CWD;

    const doctor = new Doctor(dir, config);


    if (gutil.env.heal) {
        gutil.log(doctor.heal());
    }

    gutil.log(doctor.toString());

    callback();

};
