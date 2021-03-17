const gathererJob = require('./gatherer.js');

const jobs = [
	{
		task: gathererJob.gatherData,
		enabled: true,
	},
	{
		task: () => {
			setInterval(() => console.log('testing'), 1000);
		},
		enabled: false,
	},
];

exports.startJobs = () => {
	jobs.forEach((job) => {
		if (job.enabled) {
			job.task();
		}
	});
};
