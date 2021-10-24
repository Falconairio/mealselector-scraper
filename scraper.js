const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const getFoodObject = async () => {
    function debug(titles,links, images) {
        console.log(titles.length,links.length,images.length);
    }

    function compileFoodObj(titles,links, images) {
        let foodObjects = [];
        for(let i = 0; i < images.length; i++) {
            let foodObject = {};
            foodObject.name = titles[i]
            foodObject.link = links[i];
            foodObject.image = images[i];
            foodObjects.push(foodObject)
        }
        return foodObjects;
    }

	try {
		const { data } = await axios.get(
			'https://www.pressurecookrecipes.com/easy-instant-pot-recipes/'
		);
		const $ = cheerio.load(data);
		const foodTitles = [];
        const foodLinks = [];
        const foodImages = [];
        let foodObjects = [];

		$('div > h2 > strong > a').each((_idx, el) => {
			const postTitle = $(el).text()
			foodTitles.push(postTitle)
		});

        foodTitles.splice(10,0,"Instant Pot BBQ Pulled Pork");
        foodTitles.splice(41,0,"Instant Pot Sweet Potatoes")

        $('div > h2 > strong > a').each((_idx, el) => {
            let link = el.attribs.href;
			foodLinks.push(link)
		});
        foodLinks.splice(10,0,"https://www.pressurecookrecipes.com/pressure-cooker-pulled-pork/")
        foodLinks.splice(41,0,"https://www.pressurecookrecipes.com/instant-pot-sweet-potato/")

        $('#primary > div > div.single-content.contents-wrap.tipi-row.content-bg.clearfix.article-layout-1 > div > main > article > div > div > div > figure > a > img').each((_idx, el) => {
                var secondKey = Object.keys(el.attribs)[7]; /// if image is locked behind the data src tag
                foodImages.push(el.attribs[secondKey]);
		});

        foodObjects = compileFoodObj(foodTitles,foodLinks,foodImages);
        debug(foodTitles,foodLinks,foodImages);

        return foodObjects
	} catch (error) {
		throw error;
	}
};

getFoodObject()
.then((foodObj) => {
    var json = JSON.stringify(foodObj);
    fs.readFile('myjsonfile.json', 'utf8', (err) => {
        if (err){
            console.log(err);
        } else {
        fs.writeFile('myjsonfile.json', json, 'utf8', () => {
            console.log("based");
        }); // write it back 
    }});
})
.catch((err) => {
    console.log(err);
});