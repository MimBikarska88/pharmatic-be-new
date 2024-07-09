const mongoose = require("mongoose");
const connectionString = "mongodb://localhost:27017/pharmatic";
const { medicationClass } = require("../../models/MedicationClass");
const MedicationClass = require("../../models/MedicationClass");
async function configDatabase() {
  await mongoose.connect(connectionString);
  //SeedMedications();
  console.log("database connected");
}
async function SeedMedications() {
  const medicationClasses = [
    {
      name: "adrenergic uptake inhibitors for ADHD",
      class: "Central Nervous System Agents",
    },
    { name: "analgesics", class: "Central Nervous System Agents" },
    { name: "analgesic combinations", class: "Central Nervous System Agents" },
    { name: "antimigraine agents", class: "Central Nervous System Agents" },
    { name: "CGRP inhibitors", class: "Central Nervous System Agents" },
    { name: "cox-2 inhibitors", class: "Central Nervous System Agents" },
    {
      name: "miscellaneous analgesics",
      class: "Central Nervous System Agents",
    },
    {
      name: "narcotic analgesic combinations",
      class: "Central Nervous System Agents",
    },
    {
      name: "nonsteroidal anti-inflammatory drugs",
      class: "Central Nervous System Agents",
    },
    {
      name: "opioids (narcotic analgesics)",
      class: "Central Nervous System Agents",
    },
    { name: "salicylates", class: "Central Nervous System Agents" },
    { name: "anorexiants", class: "Central Nervous System Agents" },
    { name: "anticonvulsants", class: "Central Nervous System Agents" },
    {
      name: "AMPA receptor antagonists",
      class: "Central Nervous System Agents",
    },
    {
      name: "barbiturate anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "benzodiazepine anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "carbamate anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "carbonic anhydrase inhibitor anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "dibenzazepine anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "fatty acid derivative anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "gamma-aminobutyric acid analogs",
      class: "Central Nervous System Agents",
    },
    {
      name: "gamma-aminobutyric acid reuptake inhibitors",
      class: "Central Nervous System Agents",
    },
    {
      name: "hydantoin anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "miscellaneous anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "neuronal potassium channel openers",
      class: "Central Nervous System Agents",
    },
    {
      name: "oxazolidinedione anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "pyrrolidine anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "succinimide anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "triazine anticonvulsants",
      class: "Central Nervous System Agents",
    },
    {
      name: "antiemetic/antivertigo agents",
      class: "Central Nervous System Agents",
    },
    {
      name: "5HT3 receptor antagonists",
      class: "Central Nervous System Agents",
    },
    {
      name: "anticholinergic antiemetics",
      class: "Central Nervous System Agents",
    },
    {
      name: "miscellaneous antiemetics",
      class: "Central Nervous System Agents",
    },
    {
      name: "NK1 receptor antagonists",
      class: "Central Nervous System Agents",
    },
    {
      name: "phenothiazine antiemetics",
      class: "Central Nervous System Agents",
    },
    { name: "antiparkinson agents", class: "Central Nervous System Agents" },
    {
      name: "anticholinergic antiparkinson agents",
      class: "Central Nervous System Agents",
    },
    {
      name: "dopaminergic antiparkinsonism agents",
      class: "Central Nervous System Agents",
    },
    {
      name: "miscellaneous antiparkinson agents",
      class: "Central Nervous System Agents",
    },
    {
      name: "anxiolytics, sedatives, and hypnotics",
      class: "Central Nervous System Agents",
    },
    { name: "barbiturates", class: "Central Nervous System Agents" },
    { name: "benzodiazepines", class: "Central Nervous System Agents" },
    {
      name: "miscellaneous anxiolytics, sedatives and hypnotics",
      class: "Central Nervous System Agents",
    },
    { name: "cholinergic agonists", class: "Central Nervous System Agents" },
    {
      name: "cholinesterase inhibitors",
      class: "Central Nervous System Agents",
    },
    { name: "CNS stimulants", class: "Central Nervous System Agents" },
    {
      name: "drugs used in alcohol dependence",
      class: "Central Nervous System Agents",
    },
    { name: "general anesthetics", class: "Central Nervous System Agents" },
    {
      name: "miscellaneous central nervous system agents",
      class: "Central Nervous System Agents",
    },
    { name: "muscle relaxants", class: "Central Nervous System Agents" },
    {
      name: "neuromuscular blocking agents",
      class: "Central Nervous System Agents",
    },
    {
      name: "skeletal muscle relaxant combinations",
      class: "Central Nervous System Agents",
    },
    {
      name: "skeletal muscle relaxants",
      class: "Central Nervous System Agents",
    },
    { name: "VMAT2 inhibitors", class: "Central Nervous System Agents" },
    {
      name: "agents for hypertensive emergencies",
      class: "Cardiovascular Agents",
    },
    {
      name: "agents for pulmonary hypertension",
      class: "Cardiovascular Agents",
    },
    {
      name: "aldosterone receptor antagonists",
      class: "Cardiovascular Agents",
    },
    {
      name: "angiotensin converting enzyme inhibitors",
      class: "Cardiovascular Agents",
    },
    { name: "angiotensin receptor blockers", class: "Cardiovascular Agents" },
    {
      name: "angiotensin receptor blockers and neprilysin inhibitors",
      class: "Cardiovascular Agents",
    },
    {
      name: "antiadrenergic agents, centrally acting",
      class: "Cardiovascular Agents",
    },
    {
      name: "antiadrenergic agents, peripherally acting",
      class: "Cardiovascular Agents",
    },
    { name: "antianginal agents", class: "Cardiovascular Agents" },
    { name: "antiarrhythmic agents", class: "Cardiovascular Agents" },
    { name: "group I antiarrhythmics", class: "Cardiovascular Agents" },
    { name: "group II antiarrhythmics", class: "Cardiovascular Agents" },
    { name: "group III antiarrhythmics", class: "Cardiovascular Agents" },
    { name: "group IV antiarrhythmics", class: "Cardiovascular Agents" },
    { name: "group V antiarrhythmics", class: "Cardiovascular Agents" },
    {
      name: "anticholinergic chronotropic agents",
      class: "Cardiovascular Agents",
    },
    { name: "antihypertensive combinations", class: "Cardiovascular Agents" },
    {
      name: "ACE inhibitors with calcium channel blocking agents",
      class: "Cardiovascular Agents",
    },
    { name: "ACE inhibitors with thiazides", class: "Cardiovascular Agents" },
    {
      name: "angiotensin II inhibitors with calcium channel blockers",
      class: "Cardiovascular Agents",
    },
    {
      name: "angiotensin II inhibitors with thiazides",
      class: "Cardiovascular Agents",
    },
    {
      name: "antiadrenergic agents (central) with thiazides",
      class: "Cardiovascular Agents",
    },
    { name: "beta blockers with thiazides", class: "Cardiovascular Agents" },
    {
      name: "miscellaneous antihypertensive combinations",
      class: "Cardiovascular Agents",
    },
    {
      name: "potassium sparing diuretics with thiazides",
      class: "Cardiovascular Agents",
    },
    { name: "beta-adrenergic blocking agents", class: "Cardiovascular Agents" },
    { name: "cardioselective beta blockers", class: "Cardiovascular Agents" },
    {
      name: "non-cardioselective beta blockers",
      class: "Cardiovascular Agents",
    },
    { name: "calcium channel blockers", class: "Cardiovascular Agents" },
    { name: "catecholamines", class: "Cardiovascular Agents" },
    { name: "diuretics", class: "Cardiovascular Agents" },
    { name: "carbonic anhydrase inhibitors", class: "Cardiovascular Agents" },
    { name: "loop diuretics", class: "Cardiovascular Agents" },
    { name: "miscellaneous diuretics", class: "Cardiovascular Agents" },
    { name: "potassium-sparing diuretics", class: "Cardiovascular Agents" },
    { name: "thiazide diuretics", class: "Cardiovascular Agents" },
    { name: "inotropic agents", class: "Cardiovascular Agents" },
    {
      name: "miscellaneous cardiovascular agents",
      class: "Cardiovascular Agents",
    },
  ];
  await MedicationClass.insertMany(medicationClasses);
}
module.exports = {
  configDatabase,
};
