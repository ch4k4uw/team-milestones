# team-milestones
NodeJS + Typescript + Hapi + Handlebars with Firebase integration in a basic solution to see Teams milestones.

This project get you started with a hapi API using TypeScript, as develop language, Handlebars, as views render and Firebase integration, as persistency system.

### How to run it
You will need enable the Firebase Integration. To do it you will need to add a app-keys.json in the root project directory in the following format:

```json
{
"firebase": {
		"version": "migration_number",
		"file_id": "firebase_field",
		"type": "firebase_field",
		"project_id": "firebase_field",
		"private_key_id": "firebase_field",
		"private_key": "firebase_field",
		"client_email": "firebase_field",
		"client_id": "firebase_field",
		"auth_uri": "firebase_field",
		"token_uri": "firebase_field",
		"auth_provider_x509_cert_url": "firebase_field",
		"client_x509_cert_url": "firebase_field"
	}
}
```
Where ```migration_number``` is a so basic system of migrations implemented in [firebase-database.ts](src/core/db/firebase-database.ts).

You also can change the database to the other one when necessary. Just implement a new one, following the [IDatabase](src/core/abstraction/db/database.ts) contract, replace the current one in [app-context.ts](src/core/app-context.ts) and be happy^^.
