# Tester for Ya-Micro-Batcher

This project is a test application for the (`ya-micro-batcher`)[https://www.npmjs.com/package/ya-micro-batcher] npm package. It demonstrates how to use the `YaMicroBatcher` class to batch process jobs efficiently.

## Project Structure

```
.gitignore
.prettierrc.json
eslint.config.mjs
jest.config.ts
package.json
src/
  index.ts
tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/cheburan/test_app_yamb.git
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Running the Application

To run the application, use the following command:

```sh
npm run dev
```

## Usage

The main logic is implemented in [`src/index.ts`](src/index.ts)

```typescript
import { YaMicroBatcher, JobStatus } from "ya-micro-batcher";
import type { AckJobSubmitted, JobResult } from "ya-micro-batcher";

// Batch processor function
const batchProcessor = async (jobs: Map<string, object>): Promise<JobResult<object>[]> => {
  const jobResults: JobResult<object>[] = [];
  for (const [jobId, job] of jobs) {
    jobResults.push({ jobId, status: JobStatus.PROCESSED, result: job });
  }
  return jobResults;
};

// Create a new batcher instance
const batcher = new YaMicroBatcher({
  batchSize: 10,
  batchTimeout: 10000,
  returnAck: true,
  memoryLimit: 10,
  autoProcessOnMemoryLimit: true,
  batchProcessor,
});

// Example jobs
const jobs = [
  { id: '1', data: 'Job 1', ack: '' },
  { id: '2', data: 'Job 2', ack: '' },
  { id: '3', data: 'Job 3', ack: '' },
  { id: '4', data: 'Job 4', ack: '' },
  { id: '5', data: 'Job 5', ack: '' },
];

// Submit jobs to the batcher
await Promise.all(jobs.map(async (job, idx) => {
  const res: AckJobSubmitted | void = await batcher.submit(job);
  console.log(res);
  console.log(`${idx} - count is ${batcher.jobCount()}`);
}));
console.log(batcher.jobCount());
batcher.forceProcess();
console.log(batcher.jobCount());
```

## License

This project is licensed under the MIT License.