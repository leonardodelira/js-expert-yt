import data from './../database/data.json'
import FluentSQLBuilder from './fluentSQL.js'

const result = FluentSQLBuilder.for(data)
  .where({ registered: /^(2020|2019)/ })
  .where({ category: /^(security|developer|quality assurance)$/ })
  .where({ phone: /\((852|850|810)\)/ })
  .select(['name', 'category', 'company', 'phone', 'address'])
  .orderBy('name')
  .limit(2)
  .build()

console.table(result)