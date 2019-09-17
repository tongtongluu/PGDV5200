const axios = require("axios")
const fs = require('fs')

// find id which tags  contains certain tag: cats, dogs axio.get 是个async funciton，异步功能，async和await是一对，凡是调用async，都要用await
async function search(tag) {
    const res = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${tag}`)
    return res.data
}
// fetch the object with id 
async function validId(id) {
    const res = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
    //console.log(res.data)
    return res.data
}

// try, catch error, without terminate the code
async function main() {
    let indexList = []
    let catIdList = []
    let dogIdList = []
    let commonIdList = []
    let catObjectList = []
    let dogObjectList = []
    let commonObjectList = []

    // search for ids with dog content

    try {
        const searchResult = await search("Dogs")
        console.log("total dog records: " + searchResult.total)
        for (let i = 0; i < searchResult.total; i++) {
            indexList.push(searchResult.objectIDs[i])
        }
        //console.log(searchResult)
    } catch (error) {
        console.log(error)
    }


   // search for ids with cat content
    try {
        const searchResult = await search("Cats")
        console.log("total cat records: " + searchResult.total)
        for (let i = 0; i < searchResult.total; i++) {
            indexList.push(searchResult.objectIDs[i])
        }
    } catch (error) {
        console.log(error)
    }

    let indexLen = indexList.length
// put objects into an array
    for (let index = 0; index < indexLen; index++) {
        const id = indexList[index]

        console.log(index + " of " + indexLen)
        try {
            const metObject = await validId(id)

            // divided cats, dogs, cats and dogs into three distinct lists

            if (metObject.tags.indexOf("Cats") >= 0) {
                catIdList.push(id)
                catObjectList.push(metObject)
            }

            if (metObject.tags.indexOf("Dogs") >= 0) {
                dogIdList.push(id)
                dogObjectList.push(metObject)
            }

            if (metObject.tags.indexOf("Cats") >= 0 && metObject.tags.indexOf("Dogs") >= 0) {
                commonIdList.push(id)
                commonObjectList.push(metObject)
            }
        } catch (error) {
            console.log("error")
        }
    }

    fs.writeFileSync('./catIdList.json', JSON.stringify(catIdList))
    fs.writeFileSync('./catObjectList.json', JSON.stringify(catObjectList))

    fs.writeFileSync('./dogIdList.json', JSON.stringify(dogIdList))
    fs.writeFileSync('./dogObjectList.json', JSON.stringify(dogObjectList))

    fs.writeFileSync('./commonIdList.json', JSON.stringify(commonIdList))
    fs.writeFileSync('./commonObjectList.json', JSON.stringify(commonObjectList))

}

main()


