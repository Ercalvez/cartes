//import train from './train.yaml'
import { objectMapKeys } from '@/components/utils/utils'
import trajet from './trajet.yaml'
import possession from './voiture . coût de possession.yaml'
import divers from './voiture . coûts divers.yaml'
import voiture from './voiture.yaml'

const rules = {
	//	...train,

	voyage: null,
	...voiture,
	...trajet,
	...possession,
	...divers,
}
const prefix = 'voyage'
const setPrefix = (dottedName) => `${prefix} . ${dottedName}`

const prefixExemplesSituation = (v) => {
	if (!v || !v.exemples) return v
	return {
		...v,
		exemples: v.exemples.map((exemple) => ({
			...exemple,
			situation: objectMapKeys(exemple.situation, (k) => setPrefix(k)),
		})),
	}
}
const prefixedRules = Object.fromEntries(
	Object.entries(rules).map(([k, v]) => [
		k === prefix ? k : setPrefix(k),
		prefixExemplesSituation(v),
	])
)

export default prefixedRules
