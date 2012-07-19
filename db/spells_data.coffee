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
		_description: "Launch a devastating fireball, doing {damage} damages.<br> Cost {mana_cost} mana."
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
		# name: "Replenish health"
		# _description: "Heal yourself overtime for {heal} hitpoints per turn during {round_duration} turns. Cost {mana_cost} mana."
		# thumbnail: "replenish_health"
		# requirement: 3
		# skill_points: 4
		# heal: 15
		# mana_cost: 40
		# round_duration: 3
	# ,
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
		_description: "Deal {damage} damages to your opponent. Cost {mana_cost} mana."
		thumbnail: "poison"
		is_default: 1
		damage: 10
		mana_cost: 5
	,
		name: "Wind"
		_description: "Deal {damage} damages to your opponent. Cost {mana_cost} mana."
		thumbnail: "wind"
		is_default: 1
		damage: 10
		mana_cost: 10
	,
		name: "Scream"
		_description: "Deal {damage} damages to your opponent. Cost {mana_cost} mana."
		thumbnail: "scream"
		damage: 15
		mana_cost: 10
		skill_points: 2
	,
		name: "Blast"
		_description: "Deal {damage} damages to your opponent. Cost {mana_cost} mana."
		thumbnail: "blast"
		damage: 45
		mana_cost: 35
		skill_points: 8
	,
		name: "Thunder"
		_description: "Deal {damage} damages to your opponent. Cost {mana_cost} mana."
		thumbnail: "thunder"
		damage: 30
		mana_cost: 15
		skill_points: 5
	,
		name: "Knifes"
		_description: "Deal {damage} damages to your opponent. Cost {mana_cost} mana."
		thumbnail: "knifes"
		damage: 30
		mana_cost: 20
		requirement: 2
		skill_points: 2
	,
		name: "Meteor"
		_description: "Deal {damage} damages to your opponent. Cost {mana_cost} mana."
		thumbnail: "meteor"
		damage: 50
		mana_cost: 60
		requirement: 3
		skill_points: 5
	]
	spells