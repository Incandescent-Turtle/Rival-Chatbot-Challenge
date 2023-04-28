const fs = require('fs');
const path = require('path')

const teams = load_teams()

function load_teams() {
	const file_path = path.join(__dirname, 'sports-teams.dat');
	const data = fs.readFileSync(file_path, 'utf8');
	//	Turns the data into an array where each line is a team (excludes the header line)
	const lines = data.trim().substring(data.indexOf("\n")+1).split('\n');
	//	Team object with team name as key and other properties as key-value pairs inside object
	const teams_obj = {}
	lines.forEach(line => {
		const [ name, city, league, year_founded, sport ] = line.trim().split(', ');
		teams_obj[name] = {
			city,
			league,
			year_founded: parseInt(year_founded),
			sport
		}
	})
	return teams_obj
}

function teams_founded_in(year) {
	let arr = []
	for(const [name, properties] of Object.entries(teams)) {
		if(properties.year_founded == year) {
			arr.push(name)
		}
	}
	return arr.toString()
}

//	Returns which team plays is in the given league
function which_in_league(teams_in, league) {
	for (const team_name of teams_in) {
		if(teams[team_name].league === league) {
			return team_name
		}
	}
	return null
}

//	Returns which team plays the given sport
function which_plays_sport(teams_in, sport) {
	for (const team_name of teams_in) {
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
	return Array.from(sports);
}

function get_leagues() {
	const leagues = new Set();
	Object.values(teams).forEach(team => {
		leagues.add(team.league);
	});
	return Array.from(leagues);
}

module.exports = {
	teams_founded_in,
	which_plays_sport,
	which_in_league,
	sports: get_sports(),
	leagues: get_leagues()
}