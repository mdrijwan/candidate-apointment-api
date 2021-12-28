# candidate-apointment-api

## Description

This is a a TypeScript powered REST API backend service to create candidates and book their appointments on availability.

- platform: AWS
- language: TypeScript
- environment: NodeJS
- dbSolution: dynamoDB
- framewrok: serverless
- authorName: Md Rijwan Razzaq Matin
- authorLink: 'https://github.com/mdrijwan'

## Getting Started

Clone the project repository by running the command below.

SSH:
```
git clone git@github.com:mdrijwan/candidate-apointment-api.git
```

HTTPS:
```
git clone https://github.com/mdrijwan/candidate-apointment-api.git
```

GitHub CLI:
```
gh repo clone mdrijwan/candidate-apointment-api
```

Run the command below to install NPM dependencies

```
npm install
```

This project is powered by TypeScript so no compilation needed.
You need to install dynamodb local but no worries, pre-install script will do that for you automatically.

```
sls dynamodb install
```

Then start the server and follow the instructions in the console.

```
npm run start
```

To deploy on your own AWS environment
```
npm run deploy
```

### Let's get started!

***Methods***
- GET/
  + GET/candidate `(List all the Candidates)`
  + GET/candidate/{id} `(List all the Appointments for a given Candidate)`
  + GET/appointment/{id} `(List all the Appointments for a given Candidate on a specific date)`
  + GET/availability/{id} `(List all the Available Appointments for a given Candidate)`
 
- POST/
  + POST/candidate `(Create Candidates)`
   
- PUT/
  + PUT/appointment/{id} `(Create Appointments for a given Candidate)`

  ***Functions***
  - createCandidate
  - createAppointment
  - listCandidates
  - listAppointments
  - getAppointment
  - getAvailability


### Project Structure

```
aws-serverless-api
├─ src
│ ├─ api
│ │ ├─ create.ts
│ │ ├─ get.ts
│ │ └─ list.ts
│ ├─ helpers
│ │ ├─ common.ts
│ │ ├─ formatter.ts
│ │ └─ model.ts
│ ├─ resources
│ │ └─ seedData.json
│ ├─ validator
│ │ └─ candidate.json
├─ .gitignore
├─ package.json
├─ package-lock.json
├─ serverless.yml
├─ tsconfig.json
└─ tslint.json

```