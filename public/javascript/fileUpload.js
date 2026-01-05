const rootStyles = window.getComputedStyle(document.documentElement)

if(rootStyles.getPropertyValue('--book-cover-width-large') != null &&
rootStyles.getPropertyValue('--book-cover-width-large') != ''){
  ready()
}else{
  document.getElementById('main-css').addEventListener("load", ready)
}

function ready(){
  const bookCoverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
  const bookCoverRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
  const bookCoverHeight = bookCoverWidth/bookCoverRatio

  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / bookCoverRatio,
    imageResizeTargetWidth: bookCoverWidth,
    imageResizeTargetHeight: bookCoverHeight
  })

  FilePond.parse(document.body);
}