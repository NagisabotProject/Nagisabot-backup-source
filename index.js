//定義系
const http = require("http");
const {Client,Intents,MessageEmbed} = require("discord.js");
const client = new Client({ intents: Object.keys(Intents.FLAGS)});
const {Signale} = require("signale");
const logger = new Signale();
const Keyv = require('keyv')
const token = process.env.BOT_TOKEN;
const prefix = process.env.BOT_PREFIX;

//起動構成
client.once("ready", () => {
	logger.success(`${client.user.tag}でログイン済み`);
	setInterval(() => {
  		var i = 4
  		if (i % 4 === 0) {
    		client.user.setActivity(`${prefix}help | ${client.guilds.cache.size}サーバー`, {type: "WATCHING" });
		};
		var i = 7
		if (i % 4 === 3) {
    		client.user.setActivity(`${prefix}ping | ${client.guilds.cache.map(guild => guild.memberCount).reduce((p, c) => p + c)}人のユーザー`, {type: "WATCHING" });
		};
	}, 5000);
})

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
	if (!message.author.id === "716343156513439845") return; //公開時に消す
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
	if(command === "help") {
		message.reply({
			embeds: [new MessageEmbed()
				.setTitle(":question:ヘルプ")
				.setDescription("すべてのコマンドは`" + prefix + "`で始まる必要があります。")
			]
		, allowedMentions : {repliedUser : false}})
	} else if (command === "emit") {
		message.reply({
			embeds: [new MessageEmbed()
				.setTitle(":warning:エラー")
				.setDescription("開発環境用テストコマンドは現在設定されていないため使用できません。")
				.setColor("#ff0000")
				.setFooter({text: "ErrorCode:00-2(Emit command not available)"})
			]
		})
	} else {
		message.reply({
			embeds: [new MessageEmbed()
				.setTitle(":warning:エラー")
				.setDescription("`" + message.content + "`というコマンドが見つかりませんでした！")
				.setFooter({text: `ErrorCode:00-1(Command not found)`})
				.setColor("RED")
			]
		, allowedMentions : {repliedUser : false}})
	}
});

http.createServer(function(req, res){
   res.write("OK");
   res.end();
}).listen(8080);

client.login(token);
