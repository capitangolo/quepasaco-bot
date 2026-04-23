module.exports = function(discordMessage) {
  var text = discordMessage.content;
  var embeds = discordMessage.embeds;
  var attachments = discordMessage.attachments;

  embeds.forEach( embed => {
    console.log(embed);
    var title = "Embed";
    if (embed.data.hasOwnProperty('title')) {
      title = embed.data.title;
    } else if (embed.data.hasOwnProperty('description')) {
      title = embed.data.description;
    } else if (embed.data.hasOwnProperty('url')) {
      title = embed.data.url;
    }

    md = `[${title}](${embed.data.url})`;
    if ( text.includes(embed.data.url) ) {
      text = text.replace(embed.data.url, md);
    } else {
      text += `\n${md}`;
    }
  });

  attachments.forEach( attachment => {
    if (text.length > 0) {
      text += "\n";
    }
    text += `![${attachment.contentType}](${attachment.url})`;
  });

  return text;
};
