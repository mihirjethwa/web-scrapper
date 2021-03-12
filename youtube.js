const puppeteer = require("puppeteer");
var fs = require("fs");

(async () => {
  try {
    var browser = await puppeteer.launch({ headless: true });
    var page = await browser.newPage();
    await page.goto(`https://www.youtube.com/`, { waitUntil: "load", timeout: 0 });
    await page.screenshot({ path: "screenshot.png" });
    await page.pdf({ path: "page.pdf", pageRanges: "1-2", height: "297mm", width: "210mm" });
    await page.waitForSelector("div.style-scope.ytd-rich-item-renderer");

    var youtube = await page.evaluate(() => {
      const mainNode = document.querySelectorAll(`div.style-scope.ytd-rich-item-renderer`);
      const videoLink = document.querySelectorAll(`a#video-title-link`);
      const videoThumbnail = document.querySelectorAll(`a#thumbnail >yt-img-shadow> img`);
      const videoViews = document.querySelectorAll(`div#metadata-line`);
      const videoTimeStatus = document.querySelectorAll(`ytd-thumbnail-overlay-time-status-renderer > span`);
      const channel = document.querySelectorAll(`a#avatar-link`);
      const channelImage = document.querySelectorAll(`a#avatar-link > yt-img-shadow > img`);

      testArray = [...mainNode];
      const dataArray = [];
      for (let i = 0; i < testArray.length; i++) {
        dataArray[i] = {
          videoLink: "https://youtube.com" + videoLink[i].getAttribute("href"),
          videoTitle: videoLink[i].getAttribute("title"),
          videoThumbnail: videoThumbnail[i].getAttribute("src"),
          videoViewsAndTimeUploded: videoViews[i].innerText.trim(),
          videoTimeStatus: videoTimeStatus[i].innerText.trim(),
          channelLink: "https://youtube.com" + channel[i].getAttribute("href"),
          channelName: channel[i].getAttribute("title"),
          channelImage: channelImage[i].getAttribute("src"),
        };
      }
      return dataArray;
    });
    await browser.close();
    fs.writeFile("youtubeData.json", JSON.stringify(youtube), function (err) {
      if (err) throw err;
      console.log("Data saved!");
    });
    console.log("Browser Closed");
  } catch (err) {
    console.log(error(err));
    await browser.close();
    console.log("Browser Closed");
  }
})();
