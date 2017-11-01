const gutil = require('gulp-util');
const Doctor = require('../util/doctor');

function gulpDoctor(config, callback) {
    const dir = process.env.INIT_CWD;

    let doctor;

    const wait = () => {
        if (gutil.env.heal) {
            gutil.log(doctor.heal());
        }

        gutil.log(doctor.toString());

        if (gutil.env['self-check']) {
            Doctor.asyncSelfCheck({dir, callback, logger: gutil.log});
        } else if (gutil.env.env) {
            doctor.printEnv({callback, logger: gutil.log});
        } else {
            callback();
        }
    };

    doctor = new Doctor(dir, config, wait);
}

gulpDoctor.deps = ['bad-mdl'];

module.exports = gulpDoctor;
