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
    item.onclick = () => {
      selectItem(record)
      openHauntedPage()
    };
    const establishedDisplay = (!record.fields.Established || record.fields.Established == 'N/A')
      ? ''
      : record.fields.Established
    item.title = `${establishedDisplay}
${record.fields.Country}
${record.fields["Current Function"]}`
    // Item - Image
    const itemImage = document.createElement('div')
    itemImage.classList.add('item-image')
    const imageUrl = record.fields.Appearance
      ? record.fields.Appearance[0].url
      : './21271039.png'
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
    ? `SORTED BY: ${currentSortDisplay} (${currentDirection})`
    : "SORTED BY:"
}

const sortBy = (fieldName) => {
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

var selectedItems = []

const selectItem = (item) => {
  selectedItems.push(item)
}

const resetSelectedItems = () => {
  selectedItems = []
}

const openHauntedPage = () => {
  const hauntedPage = document.getElementById("haunted-page")
  // Backgroun video
  if (selectedItems[selectedItems.length - 1]["fields"]["Video Link"]) {
    const videoLink = autoplayYoutubeLink(selectedItems[selectedItems.length - 1]["fields"]["Video Link"])
    console.log('HAS THE LINK!', videoLink)
    const videoIframe = document.createElement("embed")
    videoIframe.setAttribute("src", videoLink)
    videoIframe.classList.add('haunted-video')
    hauntedPage.appendChild(videoIframe)
  }
  hauntedPage.classList.add('show')
  // Haunted place image and details
  selectedItems.forEach(record => {
    const item = document.createElement('div')
    const itemImage = document.createElement('div')
    itemImage.classList.add('haunted-image')
    const imageUrl = record.fields.Appearance
      ? record.fields.Appearance[0].url
      : './21271039.png'
    itemImage.style.backgroundImage = `url(${imageUrl})`
    const itemDetails = document.createElement('div')
    itemDetails.classList.add('haunted-details')
    itemDetails.innerHTML = `
    <div>
      <div class="haunted-name">${record.fields.Name}</div>
      <div class="haunted-country">${record.fields.Country}</div>
      <div class="haunted-established">${record.fields.Established}</div>
      <div class="haunted-function">${record.fields["Current Function"]}</div>
    </div>`
    item.append(itemImage)
    item.append(itemDetails)
    hauntedPage.append(item)
  })
  // title
  const title = document.createElement('div')
  title.classList.add("title")
  title.innerHTML = `<h1 class="title-text">HAUNTED PLACES</h1>`
  hauntedPage.append(title)
  // reset
  const reset = document.createElement('div')
  reset.classList.add("reset")
  reset.innerHTML = `<button class="reset-btn" onclick="resetAndCloseHauntedPage()"></button>`
  hauntedPage.append(reset)
  // back
  const back = document.createElement('div')
  back.classList.add("back")
  back.innerHTML = `<button class="back-btn" onclick="closeHauntedPage()"></button>`
  hauntedPage.append(back)
}

const closeHauntedPage = () => {
  const hauntedPage = document.getElementById("haunted-page")
  hauntedPage.innerHTML = ''
  hauntedPage.classList.remove('show')
}

const resetAndCloseHauntedPage = () => {
  closeHauntedPage()
  resetSelectedItems()
}

const autoplayYoutubeLink = (link) => {
  const linkSplit = link.split("/")
  const videoId = linkSplit[linkSplit.length - 1]
  return `https://youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0&autohide=1`
}



changeSortByLabel()
fetchTableData(defaultOpitons)
