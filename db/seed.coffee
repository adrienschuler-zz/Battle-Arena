mongoose    = require("mongoose")
SpellSchema = require("../app/models/spell")
db          = mongoose.createConnection("mongodb://localhost/battle_arena")

spell_datas = require("./spells_data").initialize()

l = spell_datas.length
i = 0

mongoose.model "Spell", SpellSchema

SpellModel  = db.model("Spell")
Spell       = new SpellModel()

console.log("Dropping Spell collection...")
Spell.collection.drop()
console.log("Spell collection Dropped.")

while i < l
  s = new SpellModel(spell_datas[i])
  s.save (error, success) ->
    console.error error  if error
    console.log "Spell saved."  if success
  i++
