const helpers = require('../util/helpers');
const Doctor = require('../util/doctor');

function gulpDoctor(config, callback) {
    const dir = process.env.INIT_CWD;

    let doctor;

    const wait = () => {
        if (process.argv.includes('--heal')) {
            helpers.log(doctor.heal());
        }

        helpers.log(doctor.toString());

        if (process.argv.includes('--self-check')) {
            Doctor.asyncSelfCheck({dir, callback, logger: helpers.log});
        } else if (process.argv.includes('--env')) {
            doctor.printEnv({callback, logger: helpers.log});
        } else {
            callback();
        }
    };

    doctor = new Doctor(dir, config, wait);
}

gulpDoctor.deps = ['bad-mdl'];

module.exports = gulpDoctor;
