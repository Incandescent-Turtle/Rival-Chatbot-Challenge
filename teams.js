module.exports = {
	founded_in,
	which_of_sport,
	which_in_league,
	get_sports,
	get_leagues
}

const fs = require('fs');
const path = require('path')

const teams = load_teams()
function load_teams() {
	const file_path = path.join(__dirname, 'sports-teams.dat');
	const data = fs.readFileSync(file_path, 'utf8');
	const lines = data.trim().substring(data.indexOf("\n")+1).split('\n');
	const teams_obj = {}
	lines.forEach(line => {
		const [ name, city, league, year_founded, sport] = line.trim().split(', ');
		teams_obj[name] = { city, league, year_founded: parseInt(year_founded), sport }
	})
	return teams_obj
}

function founded_in(year) {
	let arr = []
	for(const [name, properties] of Object.entries(teams)) {
		if(properties.year_founded == year) {
			arr.push(name)
		}
	}
	return arr.toString()
}

function which_in_league(league, teams_in) {
	for (const team_name of teams_in)
	{
		if(teams[team_name].league === league) {
			return team_name
		}
	}
	return null
}

function which_of_sport(sport, teams_in) {
	for (const team_name of teams_in)
	{
		if(teams[team_name].sport === sport) {
			return team_name
		}
	}
	return null
}

function get_sports() {
	const sports = new Set();
	Object.values(teams).forEach(team => {
		sports.add(team.sport);
	});
	return sports;
}

function get_leagues() {
	const leagues = new Set();
	Object.values(teams).forEach(team => {
		leagues.add(team.league);
	});
	return leagues;
}