export async function getYTChannelAvatar(channelId) {
  try {
    const ytChannelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${process.env.YT_API_KEY}`,
      {
        referrer:
          process.env.NODE_ENV === "production"
            ? "https://pocket-feed.vercel.app"
            : "http://localhost:3000",
      }
    );

    const ytChannelData = await ytChannelResponse.json();
    const ytChannelAvatarUrl =
      ytChannelData.items[0].snippet.thumbnails.default.url;
    console.log(ytChannelAvatarUrl);
    return ytChannelAvatarUrl;
  } catch (err) {
    return null;
  }
}
