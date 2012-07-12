exports.initialize = ->
	spells = [
		name: "Punch"
		_description: "Give a punch to your opponent, doing {damage} damages."
		thumbnail: "punch"
		is_default: 1
		damage: 5
		mana_cost: 0
	,
		name: "Fireball"
		_description: "Launch a devastating fireball, doing {damage} damages. Cost {mana_cost} mana."
		thumbnail: "fireball"
		is_default: 1
		damage: 20
		mana_cost: 20
	,
		name: "Frozenball"
		_description: "Launch a frozenball, doing {damage} damages. Cost {mana_cost} mana."
		thumbnail: "frozenball"
		is_default: 1
		damage: 10
		mana_cost: 10
	,
		name: "Heal"
		_description: "Heal yourself for {heal} hitpoints. Cost {mana_cost} mana."
		thumbnail: "heal"
		is_default: 1
		heal: 15
		mana_cost: 20
	,
		name: "Replenish health"
		_description: "Heal yourself overtime for {heal} hitpoints per turn during {round_duration} turns. Cost {mana_cost} mana."
		thumbnail: "replenish_health"
		is_default: 1
		heal: 15
		mana_cost: 40
		round_duration: 3
	,
	# 	name: "Transfuse stamina"
	# 	_description: "Decrease your opponent stamina by {attributes[0].stats[0].value} and inscrease your own stamina by {attributes[1].stats[0].value}. Cost {mana_cost} mana."
	# 	thumbnail: "transfuse_stamina"
	# 	is_default: 1
	# 	mana_cost: 20
	# 	attributes: [
	# 		target: "opponent"
	# 		stats: [
	# 			stat: "stamina"
	# 			value: -5
	# 		,
	# 			target: "me"
	# 			stats: [
	# 				stat: "stamina"
	# 				value: +5
	# 			]
	# 		]
	# 	]
	# ,
		name: "Poison"
		_description: "Deal {damage} damages to your opponent during {round_duration} turns."
		thumbnail: "poison"
		is_default: 1
		damage: 5
		round_duration: 3
		mana_cost: 20
	,
		name: "Wind"
		_description: "Deal {damage} damages to your opponent."
		thumbnail: "wind"
		damage: 10
		mana_cost: 10
	]
	spells