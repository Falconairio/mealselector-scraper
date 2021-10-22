const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const getFoodObject = async () => {
    // function onlyUnique(value, index, self) {
    //     return self.indexOf(value) === index;
    //   }
	try {
		const { data } = await axios.get(
			'https://www.deliciousmagazine.co.uk/collections/student-recipes/page/4/'
		);
		const $ = cheerio.load(data);
		const foodTitles = [];
        const foodLinks = [];
        const foodImages = [];
        const foodObjects = [];

		$('body > main > div > section > div > div > div.recipe-list.recipe-archive > div > a > div.card-body > h4').each((_idx, el) => {
			const postTitle = $(el).text()
			foodTitles.push(postTitle)
		});
    //    console.log(foodTitles); 

        $('body > main > div > section > div > div > div.recipe-list.recipe-archive > div > a').each((_idx, el) => {
            let link = "www.deliciousmagazine.co.uk" + el.attribs.href;
			foodLinks.push(link)
		});
        // console.log(foodLinks);
        // var unique = foodLinks.filter(onlyUnique);
        // unique.pop()

        $('body > main > div > section > div > div > div.recipe-list.recipe-archive > div > a > div.card-img-wrapper > img').each((_idx, el) => {
                var secondKey = Object.keys(el.attribs)[1];
                foodImages.push(el.attribs[secondKey]);
		});

        for(let i = 0; i < foodImages.length; i++) {
            let foodObject = {};
            foodObject.name = foodTitles[i];
            foodObject.image = foodImages[i];
            foodObject.link = foodLinks[i];
            foodObjects.push(foodObject)
        }
        return foodObjects
	} catch (error) {
		throw error;
	}
};

getFoodObject()
.then((postTitles) => {
    // console.log(postTitles);
    var json = JSON.stringify(postTitles);
    fs.readFile('myjsonfile.json', 'utf8', (err) => {
        if (err){
            console.log(err);
        } else {
        fs.writeFile('myjsonfile.json', json, 'utf8', () => {
            console.log("based");
        }); // write it back 
    }});
});