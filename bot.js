const botConfig = require("./botsettings.json");
const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});

/*bot.commands = new Discord.Collection();  
fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);
    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if(jsfile.length <= 0){
      console.log("Couldn't find commands.");
      return;
    }
  
    jsfile.forEach((f, i) =>{
		let commandsCollection = new Discord.Collection();
		let props = require(`./commands/${f}`);
      console.log(`${f} loaded!`);
      bot.commands.set(props.help.name, props);
    });
  });*/
  
bot.on("ready", async () => {
	console.log(`${bot.user.username} is online!`);
	bot.user.setPresence({ status: 'online', game: { name: 'Super Paintball' } });
});

client.on('error', console.error);
bot.on('error', e => console.log(e))

bot.on("voiceStateUpdate", async (oldMember, newMember) => {

  let newUserChannel = newMember.voiceChannel;
  let oldUserChannel = oldMember.voiceChannel;

    if(oldMember.guild.id == "538070932871446538"){
        if(oldUserChannel === undefined && newUserChannel !== undefined){

                if(newUserChannel.members.array().length == 2){
                    let channel = await newMember.guild.createChannel(newUserChannel.name + "-no-mic", "text");
                    channel.setParent(oldMember.guild.channels.find("id", "538103640305696779"));
                    channel.overwritePermissions(oldMember, {"VIEW_CHANNEL": true, "SEND_MESSAGES": true});

                } else if(newUserChannel.members.array().length == 1){
                    return;
                } else {
                    oldMember.guild.channels.find("name", newUserChannel.name + "-no-mic").overwritePermissions(oldMember, {"VIEW_CHANNEL": true, "SEND_MESSAGES": true});
                }

        } else if(newUserChannel === undefined){
            
                if(oldUserChannel.members.array().length <= 1){
                    oldMember.guild.channels.find("name", oldUserChannel.name.toLowerCase() + "-no-mic").delete();
                } else {
                    oldMember.guild.channels.find("name", oldUserChannel.name + "-no-mic").overwritePermissions(oldMember, {"VIEW_CHANNEL": false, "SEND_MESSAGES": false});
                }

        }
    }

});

bot.on("message", async message => {
	
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;
	let prefix = botConfig.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);
    let tUser = message.guild.member(message.guild.members.get(args[0]));

    if(message.guild.id == "538070932871446538"){
        if(message.channel.name.search("no-mic")){
            fs.appendFile("./logs/" + message.channel.name.replace("-no-mic", "") + message.channel.id + ".log", message.createdAt + ", " + message.author.username + ": " + message.content + "\n", (err) => {
                if(err) console.log(err);
            })
        }
    }
    
	
});

bot.login(botConfig.token);