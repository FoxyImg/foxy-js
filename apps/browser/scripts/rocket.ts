type RecipeItem = {
	itemId: string,
	quantity: number,
}

type Recipe = {
	items: RecipeItem[],
}

const recipes:{[key:string]: Recipe } = {
	"lightning-rod": {
		items: [
			{ itemId: "copper-ingot", quantity: 3 },
		]
	},
	"iron-plate": {
		items: [
			{ itemId: "iron-ingot", quantity: 1 },
		]
	},
	"iron-rod": {
		items: [
			{ itemId: "iron-plate", quantity: 2 },
		]
	},
	"steel-ingot": {
		items: [
			{ itemId: "iron-ingot", quantity: 1 },
			{ itemId: "charcoal", quantity: 1 },
		]
	},
	"steel-block": {
		items: [
			{ itemId: "steel-ingot", quantity: 9 },
		]
	},
	"steel-plate": {
		items: [
			{ itemId: "steel-ingot", quantity: 1 },
		]
	},
	"steel-rod": {
		items: [
			{ itemId: "steel-plate", quantity: 2 },
		]
	},
	"rocket-nose": {
		items: [
			{ itemId: "lightning-rod", quantity: 1 },
			{ itemId: "steel-plate", quantity: 4 },
		]
	},
	"rocket-fin": {
		items: [
			{ itemId: "steel-plate", quantity: 6 },
		]
	},
	"gas-tank": {
		items: [
			{ itemId: "iron-plate", quantity: 4 },
			{ itemId: "iron-rod", quantity: 1 },
		]
	},
	"steel-tank": {
		items: [
			{ itemId: "steel-plate", quantity: 4 },
			{ itemId: "steel-rod", quantity: 1 },
			{ itemId: "gas-tank", quantity: 1 },
		]
	},
	"engine-frame": {
		items: [
			{ itemId: "steel-rod", quantity: 8 },
		]
	},
	"fan": {
		items: [
			{ itemId: "steel-plate", quantity: 4 },
			{ itemId: "steel-rod", quantity: 1 },
		]
	},
	"steel-engine": {
		items: [
			{ itemId: "steel-plate", quantity: 5 },
			{ itemId: "engine-frame", quantity: 1 },
			{ itemId: "fan", quantity: 1 },
		]
	},
	"rocket-level-1": {
		items: [
			{ itemId: "launch-pad", quantity: 1 },
			{ itemId: "rocket-nose", quantity: 1 },
			{ itemId: "rocket-fin", quantity: 4 },
			{ itemId: "steel-engine", quantity: 1 },
			{ itemId: "steel-tank", quantity: 2 },
			{ itemId: "steel-block", quantity: 6 },
		]
	},
	"launch-pad": {
		items: [
			{ itemId: "steel-plate", quantity: 5 },
			{ itemId: "steel-rod", quantity: 4 },
		]
	},
}

function calculateCost(recipeName:string, quantity: number):RecipeItem[] {
	const tempItems:RecipeItem[] = [];
	const recipe = recipes[recipeName];
	for(const item of recipe.items) {
		tempItems.push({
			itemId: item.itemId,
			quantity: item.quantity * quantity,
		});

		if (recipes[item.itemId]) {
			tempItems.push(...calculateCost(item.itemId, item.quantity * quantity));
		}
	}

	const uniqueItemIds = tempItems.map(item => item.itemId).filter((itemId, index, self) => self.indexOf(itemId) === index);
	console.log(uniqueItemIds);

	const finalItems:RecipeItem[] = [];
	for(const itemId of uniqueItemIds) {
		const items = tempItems.filter(item => item.itemId === itemId);
		finalItems.push({
			itemId,
			quantity: items.reduce((acc, item) => acc + item.quantity, 0),
		});
	}

	return finalItems.sort((a, b) => b.quantity - a.quantity);
}

const items = calculateCost("rocket-level-1", 1);
for(const item of items) {
	console.log(item.itemId, item.quantity);
}