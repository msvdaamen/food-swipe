import { defineConfig } from 'kysely-ctl'
import {PostgresJSDialect} from 'kysely-postgres-js'
import postgres from 'postgres'

export default defineConfig({
	// replace me with a real dialect instance OR a dialect name + `dialectConfig` prop.
	dialect: new PostgresJSDialect({
		postgres: postgres(process.env.DATABASE_URL),
	}),
	migrations: {
		migrationTableName: 'migrations'
	},
	//   plugins: [],
	//   seeds: {
	//     seedFolder: "seeds",
	//   }
})
