import { YaMicroBatcher, JobStatus } from "ya-micro-batcher";
import type { AckJobSubmitted, JobResult } from "ya-micro-batcher";


const batchProcessor = async (jobs: Map<string, object>): Promise<JobResult<object>[]> => {
  const jobResults: JobResult<object>[] = [];
  for (const [jobId, job] of jobs) {
    jobResults.push({ jobId, status: JobStatus.PROCESSED, result:job });
  }
  return jobResults
};

const batcher = new YaMicroBatcher({
  batchSize: 10,
  batchTimeout: 10000,
  returnAck: true,
  memoryLimit: 10,
  autoProcessOnMemoryLimit: true,
  batchProcessor,
});

const jobs = [
  { id: '1', data: 'Job 1', ack: '' },
  { id: '2', data: 'Job 2', ack: '' },
  { id: '3', data: 'Job 3', ack: '' },
  { id: '4', data: 'Job 4', ack: '' },
  { id: '5', data: 'Job 5', ack: '' },
];

await Promise.all(jobs.map(async (job, idx) => {
  const res: AckJobSubmitted | void = await batcher.submit(job);
  console.log(res);
  console.log(`${idx} - count is ${batcher.jobCount()}`);
}));
console.log(batcher.jobCount());
batcher.forceProcess();
console.log(batcher.jobCount());