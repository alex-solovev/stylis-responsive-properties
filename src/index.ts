type MediaTuple = [number, string?]

type PropertyData = {
  selectors: string[] | undefined;
  property: string;
  medias: MediaTuple[];
  startingIndex: number;
  endingIndex: number;
}

type MediaMap = {
  [key: number]: string[][]
}

enum StylisContext {
  POST_PROCESS = -2,
  PREPARATION,
  EVERY_NEW_LINE,
  PROPERTY_DECLARATION,
  SELECTOR_BLOCK,
  MEDIA_RULE,
}

const mediaListRegex = /([a-z\-]+)*:\s*(\{(.*\n*)[^}]+\})/gm
const selectorRegex = /.*(?<!\:)\s*\{/gm
const selectorBlockRegex = /.*(?<!\:)\s*\{((.*\n*)[^}]+)\}/gm
const bracesRegex = /\{|\}/gm

function getMediaTuples(value: string): MediaTuple[] {
  return value
    .replace(bracesRegex, "")
    .split(";")
    .filter(m => m.trim())
    .map(m => {
      const [media, value] = m.split(":")
      return [parseInt(media, 10), value]
    })
}

function getSelectors(startingIndex: number, content: string) {
  const selectors: string[] | undefined = content
    .slice(0, startingIndex)
    .replace(mediaListRegex, "")
    .replace(selectorBlockRegex, "")
    .match(selectorRegex)
    ?.map(s => s.replace(/\{/, "").trim())

  return selectors
}

function getDefaultValue(medias: MediaTuple[]) {
  const found = medias.find(m => m[0] === 0)
  return found ? found[1] : ""
}

function mapMediaData(data: PropertyData[]): MediaMap {
  let mediaMap: MediaMap = {}

  for (let entry of data) {
    for (let [mediaValue, propValue] of entry.medias) {
      const css = `${entry.property}: ${propValue?.trim()}`

      mediaMap = {
        ...mediaMap,
        [mediaValue]: [
          ...(mediaMap[mediaValue] || []),
          [...(entry.selectors || []), css],
        ]
      }
    }
  }

  return mediaMap
}

function buildMedias(data: PropertyData[]): string {
  const mediaMap: MediaMap = mapMediaData(data)
  let medias: string = ""

  for (let mediaValue of Object.keys(mediaMap)) {
    let head = `@media screen and (min-width: ${mediaValue.trim()}px)`
    let body: string[] = []

    for (let values of mediaMap[parseInt(mediaValue, 10)]) {
      const css = values[values.length - 1] + ";"
      const selectors: string[] = values.slice(0, values.length - 1)

      body.push(
        selectors
          ? selectors.reverse().reduce((acc, cur) => `${cur} {${acc}}`, css)
          : css
      )
    }

    medias = medias + `${head} {${body.join("")}}`
  }

  return medias
}


function stylisResponsiveValues(
  context: number,
  content: string,
  _selectors: string[] | undefined,
  _parent: string[],
  _line: number,
  _column: number,
  _length: number,
): string | null {


  switch (context) {
    case StylisContext.PREPARATION: {
      let replacedContent: string = content
      let data: PropertyData[] = []
      let matches = [...content.matchAll(mediaListRegex)]

      for (let match of matches) {
        const startingIndex = match.index || 0
        const endingIndex = startingIndex + match[0].length
        const property = match[1]
        const mediaGroup = match[2]
        const medias = getMediaTuples(mediaGroup)
        const propertyWithMedia: PropertyData = {
          selectors: getSelectors(startingIndex, content),
          medias: medias.filter(m => m[0] > 0),
          property,
          startingIndex,
          endingIndex,
        }

        data.push(propertyWithMedia)
        replacedContent = replacedContent.replace(
          mediaGroup,
          `${getDefaultValue(medias)};`,
        )
      }

      return replacedContent + buildMedias(data)
    }
  }

  return content
}

export default stylisResponsiveValues