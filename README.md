# Smart Patient Flow

Build a professional, responsive healthcare web application called SmartTriage — Smart Patient Queue & Emergency Triage.

Problem: Hospital emergency departments receive patients with different levels of urgency. Staff need a reliable way to register patients, assess urgency, prioritize the waiting queue, and track patient flow from registration to consultation.

1. Patient registration

Create a registration form containing:

- Patient ID (generated automatically)

- Name or fictional demo identifier

- Age

- Symptoms and relevant medical conditions

- Registration time

Validate required fields and display clear error messages.

2. Urgency assessment

Allow authorized healthcare staff to record a triage category using a defined protocol. For the demonstration, support Critical, High, Moderate, and Low categories.

Do not claim to diagnose patients automatically. Clearly label demonstration rules as simulated and require qualified clinical assessment for real triage decisions.

3. Dynamic priority queue

Display registered patients in a sortable queue:

- Higher urgency comes first.

- Within the same urgency category, patients waiting longer come first.

- Recalculate the queue when urgency or patient status changes.

- Exclude patients marked Completed from the waiting queue.

- Clearly highlight critical cases and provide an escalation indicator.

4. Staff dashboard

Show summary cards for:

- Total registered patients

- Currently waiting

- In consultation

- Completed

Display patient ID, urgency, symptoms summary, wait duration, and current status.

Provide actions to update status to Waiting, In Consultation, or Completed. Confirm important status changes.

5. Design

Use a clean hospital dashboard design with:

- White background and restrained medical-blue accents

- Clear urgency labels with text as well as colors

- Readable tables, accessible controls, and responsive layouts

- A patient registration page or modal

- Search and urgency/status filters

- A useful empty state when there are no patients

6. Functionality and reliability

Make all buttons and forms functional. Use fictional sample patients for the demo. Persist data where feasible and clearly indicate whether data is stored locally or in a configured backend.

Do not include real patient information. Do not expose sensitive information publicly. Do not claim that real-time synchronization, authentication, or database storage works unless implemented and tested.

Implementation order

First build the registration form, staff dashboard, priority-sorting logic, and status updates. Then test the full patient journey. Prioritize functional behavior over extra animations or unnecessary features.

Before finishing, report any incomplete functionality and the steps needed to test the application.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/55347ee5-a44f-583e-bdf7-b22375414649).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
