const Airtable = require('airtable')
Airtable.configure({
  apiKey: 'key6iUZ7THrE8cmvS',
  endpointUrl: 'https://api.airtable.com',
})

const base = Airtable.base('appmN6bgrkxUTOzZO')

const resetTable = () => {
  const itemContainer = document.querySelector('#item-container')
  itemContainer.innerHTML = ''
}

const createTable = records => {
  const itemContainer = document.querySelector('#item-container')
  records.forEach(record => {
    // Item
    const item = document.createElement('div')
    item.classList.add('item')
    // Item - Image
    const itemImage = document.createElement('div')
    itemImage.classList.add('item-image')
    const imageUrl = record.fields.Appearance
      ? record.fields.Appearance[0].url
      : './21271038.png'
    itemImage.style.backgroundImage = `url(${imageUrl})`
    // Item - Label
    const itemLabel = document.createElement('div')
    itemLabel.classList.add('item-label')
    itemLabel.innerHTML = record.fields.Name
    // Add divs in order
    item.append(itemImage)
    item.append(itemLabel)
    itemContainer.append(item)
  })
}

const fetchTableData = apiOptions => {
  base('Table 1')
  .select(apiOptions)
  .eachPage((records, fetchNextPage) => {
    createTable(records)
    fetchNextPage()
    }, err => {
      if (err) { console.error(err); return }
    }
  )
}

const fetchOneItem = (id) => {
  base('Table 1').find(id, function(err, record) {
    if (err) { console.error(err); return }
    console.log('Retrieved', record.id)
  })
}

const defaultOpitons = {
  maxRecords: 110,
  view: 'Grid view',
}

const sortController = {
  'current': null,
  'Established': null,
  'Country': null,
  'Current Function': null,
  'Name': null,
}

const switchFieldName = {
  'Established': 'Date',
  'Country': 'REGION',
  'Current Function': 'FUNCTION',
  'Name': 'ALPHABETICAL',
}

const changeSortByLabel = () => {
  const sortByLabel = document.getElementById("sorted-by-label")
  const currentSort = sortController['current']
  const currentSortDisplay = switchFieldName[currentSort]
  const currentDirection = sortController[currentSort]
  sortByLabel.innerHTML = (currentSortDisplay && currentDirection)
    ? `Sorted By: ${currentSortDisplay} (${currentDirection})`
    : "Sorted By:"
}

const sortBy = (fieldName) => {
  console.log("EXECUTED!")
  const direction = (sortController[fieldName] == null)
    ? 'asc'
    : (sortController[fieldName] == 'desc')
      ? 'asc'
      : 'desc'
  sortController[fieldName] = direction
  sortController['current'] = fieldName
  const option = {
    ...defaultOpitons,
    sort: [{field: fieldName, direction}],
  }
  changeSortByLabel()
  resetTable()
  fetchTableData(option)
}

changeSortByLabel()
fetchTableData(defaultOpitons)
