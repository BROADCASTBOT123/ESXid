// Load up the discord.js library
const { Client, Attachment , RichEmbed} = require('discord.js');

const config = require("./config.json");
var mysql = require('mysql');
const request = require('request');
var con = mysql.createConnection({
  host: "localhost",
  user: config.usernamedb,
  password: config.passworddb,
  database : config.dbname,
  insecureAuth : true
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Client();

// Here we load the config.json file that contains our token and our prefix values. 

// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(``);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
 // console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
 // client.user.setActivity(`Serving ${client.guilds.size} servers`);
});
client.on("message", async message => {

  if(message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if (command === "info") {
    if (args[0] !== undefined) {
    con.query("SELECT * FROM users WHERE firstname = '"+args[0]+"'AND lastname ='"+args[1]+"'", function (err, result, fields) {
      if (err)  message.channel.send("Error.\n" +err );
      
      if (result[0] === undefined) {

        message.channel.send("No user found...")
      }
      else{
        var steamid = result[0].identifier;
      //  console.log(result)
        const c = result[0];
        con.query("SELECT * FROM user_accounts WHERE identifier='"+steamid+"'", function (err, result4, fields) {
        

        const embed = new RichEmbed()
      
        .setTitle("Information")
        .setAuthor(message.author.username, message.author.avatarURL)
       
        .setColor(0x00AE86)
        .setDescription(c.firstname + " "+ c.lastname +" " + c.dateofbirth + " " + c.sex)
        .setFooter("© By Thanos", message.author.avatarURL)
        .addField("📱 رقم الهاتف",c.phone_number,true)
        .addField("💵 المال",c.money+"$",true)
        .addField("💳 مال البنك",c.bank+"$",true)
        .addField("⛏ الوظيفة",c.job,true)
        

        .addField("💻 ايدي ستيم",c.identifier,true)
        .addField("⌨️ سيريال",c.license,true)

        .addField("💎 اسم ستيم",c.name,true)

        .setTimestamp(new Date())
        

      
        message.channel.send({embed});
      
      });
      }
    });
  }
    else{

      message.channel.send("No user found...")
    }
  }

});


client.login(process.env.TOKEN);
