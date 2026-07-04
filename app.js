'use strict';
// ╔══════════════════════════════════════════════════════════╗
// ║  WORLD CUP 2026 — LIVE TRACKER + ADAPTIVE PREDICTOR    ║
// ║  Single-file logic · localStorage persistence · PWA      ║
// ╚══════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────
const GROUPS_META = {
    A: ["Mexico", "South Korea", "South Africa", "Czechia"],
    B: ["Canada", "Switzerland", "Bosnia & Herz.", "Qatar"],
    C: ["Brazil", "Scotland", "Morocco", "Haiti"],
    D: ["USA", "Australia", "Paraguay", "Türkiye"],
    E: ["Germany", "Ecuador", "Côte d'Ivoire", "Curaçao"],
    F: ["Netherlands", "Japan", "Sweden", "Tunisia"],
    G: ["Belgium", "Egypt", "Iran", "New Zealand"],
    H: ["Spain", "Cape Verde", "Saudi Arabia", "Uruguay"],
    I: ["France", "Norway", "Senegal", "Iraq"],
    J: ["Argentina", "Austria", "Algeria", "Jordan"],
    K: ["Portugal", "Colombia", "DR Congo", "Uzbekistan"],
    L: ["England", "Croatia", "Ghana", "Panama"],
};

const FLAGS = {
    "Mexico": "🇲🇽", "South Africa": "🇿🇦", "South Korea": "🇰🇷", "Czechia": "🇨🇿", "Canada": "🇨🇦",
    "Switzerland": "🇨🇭", "Bosnia & Herz.": "🇧🇦", "Qatar": "🇶🇦", "Brazil": "🇧🇷", "Scotland": "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    "Morocco": "🇲🇦", "Haiti": "🇭🇹", "USA": "🇺🇸", "Australia": "🇦🇺", "Paraguay": "🇵🇾", "Türkiye": "🇹🇷",
    "Germany": "🇩🇪", "Ecuador": "🇪🇨", "Côte d'Ivoire": "🇨🇮", "Curaçao": "🇨🇼", "Netherlands": "🇳🇱",
    "Japan": "🇯🇵", "Sweden": "🇸🇪", "Tunisia": "🇹🇳", "Belgium": "🇧🇪", "Egypt": "🇪🇬", "Iran": "🇮🇷",
    "New Zealand": "🇳🇿", "Spain": "🇪🇸", "Cape Verde": "🇨🇻", "Saudi Arabia": "🇸🇦", "Uruguay": "🇺🇾",
    "France": "🇫🇷", "Norway": "🇳🇴", "Senegal": "🇸🇳", "Iraq": "🇮🇶", "Argentina": "🇦🇷", "Austria": "🇦🇹",
    "Algeria": "🇩🇿", "Jordan": "🇯🇴", "Portugal": "🇵🇹", "Colombia": "🇨🇴", "DR Congo": "🇨🇩", "Uzbekistan": "🇺🇿",
    "England": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Croatia": "🇭🇷", "Ghana": "🇬🇭", "Panama": "🇵🇦",
};
const F = t => FLAGS[t] || "🏳";

// ── DETAILED MATCH SCORERS DATABASE ──
const MATCH_SCORERS_DB = {
    "MexicovsSouth Africa": {
        home: [{ name: "Raúl Jiménez", min: "14'" }, { name: "Santiago Giménez", min: "76'" }],
        away: []
    },
    "South KoreavsCzechia": {
        home: [{ name: "Son Heung-min", min: "33'" }, { name: "Lee Kang-in", min: "82'" }],
        away: [{ name: "Patrik Schick", min: "45'" }]
    },
    "CanadavsBosnia & Herz.": {
        home: [{ name: "Jonathan David", min: "58'" }],
        away: [{ name: "Edin Džeko", min: "12'" }]
    },
    "USAvsParaguay": {
        home: [{ name: "Folarin Balogun", min: "21', 65'" }, { name: "Christian Pulisic", min: "40'" }, { name: "Timothy Weah", min: "78'" }],
        away: [{ name: "Miguel Almirón", min: "50'" }]
    },
    "QatarvsSwitzerland": {
        home: [{ name: "Akram Afif", min: "44'" }],
        away: [{ name: "Johan Manzambi", min: "70'" }]
    },
    "BrazilvsMorocco": {
        home: [{ name: "Matheus Cunha", min: "29'" }],
        away: [{ name: "Ismael Saibari", min: "68'" }]
    },
    "HaitivsScotland": {
        home: [],
        away: [{ name: "John McGinn", min: "37'" }]
    },
    "AustraliavsTürkiye": {
        home: [{ name: "Nestory Irankunda", min: "18'" }, { name: "Connor Metcalfe", min: "73'" }],
        away: []
    },
    "GermanyvsCuraçao": {
        home: [
            { name: "Kai Havertz", min: "8', 31'" },
            { name: "Florian Wirtz", min: "19'" },
            { name: "Jamal Musiala", min: "27'" },
            { name: "Niclas Füllkrug", min: "55'" },
            { name: "Serge Gnabry", min: "72'" },
            { name: "Leroy Sané", min: "88'" }
        ],
        away: [{ name: "Juninho Bacuna", min: "61'" }]
    },
    "NetherlandsvsJapan": {
        home: [{ name: "Cody Gakpo", min: "15'" }, { name: "Memphis Depay", min: "78'" }],
        away: [{ name: "Kaoru Mitoma", min: "40'" }, { name: "Ayase Ueda", min: "90+2'" }]
    },
    "Côte d'IvoirevsEcuador": {
        home: [{ name: "Sébastien Haller", min: "64'" }],
        away: []
    },
    "SwedenvsTunisia": {
        home: [
            { name: "Yasin Ayari", min: "11', 52'" },
            { name: "Alexander Isak", min: "29'" },
            { name: "Dejan Kulusevski", min: "45+1'" },
            { name: "Viktor Gyökeres", min: "81'" }
        ],
        away: [{ name: "Youssef Msakni", min: "70'" }]
    },
    "SpainvsCape Verde": {
        home: [],
        away: []
    },
    "BelgiumvsEgypt": {
        home: [{ name: "Romelu Lukaku", min: "49'" }],
        away: [{ name: "Mostafa Mohamed", min: "35'" }]
    },
    "Saudi ArabiavsUruguay": {
        home: [{ name: "Salem Al-Dawsari", min: "42'" }],
        away: [{ name: "Darwin Núñez", min: "55'" }]
    },
    "IranvsNew Zealand": {
        home: [{ name: "Mehdi Taremi", min: "22'" }, { name: "Sardar Azmoun", min: "74'" }],
        away: [{ name: "Elijah Just", min: "15', 68'" }]
    },
    "FrancevsSenegal": {
        home: [{ name: "Kylian Mbappé", min: "30', 77'" }, { name: "Antoine Griezmann", min: "45'" }],
        away: [{ name: "Nicolas Jackson", min: "60'" }]
    },
    "IraqvsNorway": {
        home: [{ name: "Aymen Hussein", min: "41'" }],
        away: [{ name: "Erling Haaland", min: "14', 59'" }, { name: "Martin Ødegaard", min: "32'" }, { name: "Antonio Nusa", min: "85'" }]
    },
    "ArgentinavsAlgeria": {
        home: [{ name: "Lionel Messi", min: "24', 60', 85'" }],
        away: []
    },
    "AustriavsJordan": {
        home: [{ name: "Marcel Sabitzer", min: "18'" }, { name: "Christoph Baumgartner", min: "50'" }, { name: "Michael Gregoritsch", min: "79'" }],
        away: [{ name: "Musa Al-Taamari", min: "33'" }]
    },
    "PortugalvsDR Congo": {
        home: [{ name: "Bruno Fernandes", min: "28'" }],
        away: [{ name: "Yoane Wissa", min: "67'" }]
    },
    "EnglandvsCroatia": {
        home: [{ name: "Harry Kane", min: "20', 88'" }, { name: "Jude Bellingham", min: "45'" }, { name: "Bukayo Saka", min: "62'" }],
        away: [{ name: "Andre Kramarić", min: "35'" }, { name: "Luka Modrić", min: "74'" }]
    },
    "GhanavsPanama": {
        home: [{ name: "Mohammed Kudus", min: "81'" }],
        away: []
    },
    "UzbekistanvsColombia": {
        home: [{ name: "Eldor Shomurodov", min: "48'" }],
        away: [{ name: "Luis Díaz", min: "12'" }, { name: "James Rodríguez", min: "35'" }, { name: "Jhon Durán", min: "75'" }]
    },
    "CzechiavsSouth Africa": {
        home: [{ name: "Tomáš Souček", min: "50'" }],
        away: [{ name: "Lyle Foster", min: "71'" }]
    },
    "SwitzerlandvsBosnia & Herz.": {
        home: [{ name: "Breel Embolo", min: "15'" }, { name: "Johan Manzambi", min: "44'" }, { name: "Granit Xhaka", min: "62'" }, { name: "Zeki Amdouni", min: "81'" }],
        away: [{ name: "Ermedin Demirović", min: "70'" }]
    },
    "CanadavsQatar": {
        home: [
            { name: "Jonathan David", min: "10', 41'" },
            { name: "Cyle Larin", min: "25', 68'" },
            { name: "Tajon Buchanan", min: "55'" },
            { name: "Alphonso Davies", min: "83'" }
        ],
        away: []
    },
    "MoroccovsScotland": {
        home: [{ name: "Youssef En-Nesyri", min: "54'" }],
        away: []
    },
    "BrazilvsHaiti": {
        home: [{ name: "Vinícius Júnior", min: "14', 59'" }, { name: "Matheus Cunha", min: "42'" }],
        away: []
    },
    "USAvsAustralia": {
        home: [{ name: "Gio Reyna", min: "30'" }, { name: "Folarin Balogun", min: "75'" }],
        away: []
    },
    "TürkiyevsParaguay": {
        home: [],
        away: [{ name: "Antonio Sanabria", min: "68'" }]
    },
    "MexicovsSouth Korea": {
        home: [{ name: "Santiago Giménez", min: "84'" }],
        away: []
    }
};

// ── TOURNAMENT PLAYERS DATABASE FOR DYNAMIC GENERATION ──
const TEAM_PLAYERS = {
    "Mexico": ["Raúl Jiménez", "Santiago Giménez", "Hirving Lozano", "Edson Álvarez", "Orbelín Pineda", "Henry Martín", "César Montes", "Luis Chávez"],
    "South Africa": ["Percy Tau", "Themba Zwane", "Teboho Mokoena", "Evidence Makgopa", "Lyle Foster", "Khuliso Mudau", "Aubrey Modiba"],
    "South Korea": ["Son Heung-min", "Hwang Hee-chan", "Lee Kang-in", "Cho Gue-sung", "Kim Min-jae", "Lee Jae-sung", "Jeong Woo-yeong"],
    "Czechia": ["Patrik Schick", "Tomáš Souček", "Adam Hložek", "Václav Černý", "Jan Kuchta", "Ladislav Krejčí", "Lukáš Provod"],
    "Canada": ["Jonathan David", "Cyle Larin", "Alphonso Davies", "Tajon Buchanan", "Stephen Eustáquio", "Jacob Shaffelburg", "Ismaël Koné"],
    "Switzerland": ["Breel Embolo", "Xherdan Shaqiri", "Zeki Amdouni", "Granit Xhaka", "Dan Ndoye", "Ruben Vargas", "Johan Manzambi", "Denis Zakaria"],
    "Bosnia & Herz.": ["Edin Džeko", "Ermedin Demirović", "Miralem Pjanić", "Haris Hajradinović", "Amar Dedić", "Sead Kolašinac"],
    "Qatar": ["Akram Afif", "Almoez Ali", "Hassan Al-Haydos", "Yusuf Abdurisag", "Boualem Khoukhi", "Abdulaziz Hatem"],
    "Brazil": ["Vinícius Júnior", "Rodrygo", "Richarlison", "Gabriel Martinelli", "Bruno Guimarães", "Matheus Cunha", "Raphinha", "Lucas Paquetá"],
    "Morocco": ["Youssef En-Nesyri", "Hakim Ziyech", "Achraf Hakimi", "Ismael Saibari", "Amine Adli", "Sofiane Boufal", "Brahim Díaz"],
    "Haiti": ["Duckens Nazon", "Frantzdy Pierrot", "Louicius Don Deedson", "Derrick Etienne", "Fafa Picault"],
    "Scotland": ["John McGinn", "Scott McTominay", "Ché Adams", "Lawrence Shankland", "Andrew Robertson", "Billy Gilmour", "Ryan Christie"],
    "Australia": ["Nestory Irankunda", "Connor Metcalfe", "Mitchell Duke", "Craig Goodwin", "Jackson Irvine", "Harry Souttar", "Kye Rowles"],
    "Türkiye": ["Kerem Aktürkoğlu", "Kenan Yıldız", "Hakan Çalhanoğlu", "Barış Alper Yılmaz", "Arda Güler", "Cenk Tosun", "Orkun Kökçü"],
    "Germany": ["Kai Havertz", "Niclas Füllkrug", "Florian Wirtz", "Jamal Musiala", "Leroy Sané", "Serge Gnabry", "İlkay Gündoğan", "Thomas Müller"],
    "Curaçao": ["Juninho Bacuna", "Rangelo Janga", "Kenji Gorré", "Gervane Kastaneer", "Vurnon Anita", "Leandro Bacuna"],
    "Netherlands": ["Cody Gakpo", "Memphis Depay", "Wout Weghorst", "Donyell Malen", "Xavi Simons", "Teun Koopmeiners", "Tijjani Reijnders", "Frenkie de Jong"],
    "Japan": ["Kaoru Mitoma", "Ayase Ueda", "Takumi Minamino", "Takefusa Kubo", "Ritsu Doan", "Daizen Maeda", "Wataru Endo", "Hidemasa Morita"],
    "Sweden": ["Alexander Isak", "Viktor Gyökeres", "Dejan Kulusevski", "Yasin Ayari", "Emil Forsberg", "Anthony Elanga", "Hugo Larsson"],
    "Tunisia": ["Youssef Msakni", "Wahbi Khazri", "Elias Achouri", "Seifeddine Jaziri", "Aïssa Laïdouni", "Ellyes Skhiri"],
    "Spain": ["Álvaro Morata", "Ferran Torres", "Dani Olmo", "Nico Williams", "Lamine Yamal", "Pedri", "Gavi", "Mikel Oyarzabal", "Rodri"],
    "Cape Verde": ["Ryan Mendes", "Garry Rodrigues", "Bebé", "Jovane Cabral", "Kenny Rocha", "Jamiro Monteiro"],
    "Saudi Arabia": ["Salem Al-Dawsari", "Firas Al-Buraikan", "Saleh Al-Shehri", "Abdulrahman Ghareeb", "Mohamed Kanno", "Fahad Al-Muwallad"],
    "Uruguay": ["Darwin Núñez", "Luis Suárez", "Federico Valverde", "Facundo Pellistri", "Giorgian de Arrascaeta", "Maximiliano Araújo", "Nicolas de la Cruz"],
    "Belgium": ["Romelu Lukaku", "Leandro Trossard", "Jérémy Doku", "Kevin De Bruyne", "Lois Openda", "Charles De Ketelaere", "Youri Tielemans", "Amadou Onana"],
    "Egypt": ["Mohamed Salah", "Mostafa Mohamed", "Trezeguet", "Omar Marmoush", "Mohamed Elneny", "Zizo"],
    "Iran": ["Mehdi Taremi", "Sardar Azmoun", "Alireza Jahanbakhsh", "Saman Ghoddos", "Mehdi Torabi", "Ali Gholizadeh"],
    "New Zealand": ["Chris Wood", "Elijah Just", "Ben Waine", "Kosta Barbarouses", "Joe Bell", "Sarpreet Singh", "Liberato Cacace"],
    "France": ["Kylian Mbappé", "Olivier Giroud", "Antoine Griezmann", "Ousmane Dembélé", "Marcus Thuram", "Randal Kolo Muani", "Eduardo Camavinga", "Aurélien Tchouamén"],
    "Senegal": ["Sadio Mané", "Nicolas Jackson", "Ismaïla Sarr", "Boulaye Dia", "Habib Diallo", "Idrissa Gueye", "Lamine Camara"],
    "Iraq": ["Aymen Hussein", "Mohanad Ali", "Ali Jasim", "Ibrahim Bayesh", "Amir Al-Ammari", "Youssef Amyn"],
    "Norway": ["Erling Haaland", "Alexander Sørloth", "Martin Ødegaard", "Antonio Nusa", "Jørgen Strand Larsen", "Patrick Berg", "Sander Berge"],
    "Argentina": ["Lionel Messi", "Lautaro Martínez", "Julián Álvarez", "Ángel Di María", "Enzo Fernández", "Alexis Mac Allister", "Rodrigo De Paul", "Giovani Lo Celso"],
    "Algeria": ["Riyad Mahrez", "Baghdad Bounedjah", "Amine Gouiri", "Farès Chaïbi", "Houssem Aouar", "Saïd Benrahma", "Ismaël Bennacer"],
    "Austria": ["Marcel Sabitzer", "Marko Arnautović", "Christoph Baumgartner", "Michael Gregoritsch", "Konrad Laimer", "Patrick Wimmer", "Florian Kainz"],
    "Jordan": ["Musa Al-Taamari", "Yazan Al-Naimat", "Ali Olwan", "Nizar Al-Rashdan", "Mahmoud Al-Mardi"],
    "Portugal": ["Cristiano Ronaldo", "Bruno Fernandes", "Bernardo Silva", "Diogo Jota", "Rafael Leão", "João Félix", "Gonçalo Ramos", "Vitinha", "João Neves"],
    "DR Congo": ["Yoane Wissa", "Cédric Bakambu", "Theo Bongonda", "Meschack Elia", "Samuel Moutoussamy", "Charles Pickel"],
    "England": ["Harry Kane", "Jude Bellingham", "Bukayo Saka", "Phil Foden", "Ollie Watkins", "Cole Palmer", "Marcus Rashford", "Declan Rice", "Kobbie Mainoo"],
    "Croatia": ["Andrej Kramarić", "Luka Modrić", "Ivan Perišić", "Bruno Petković", "Mario Pašalić", "Mateo Kovačić", "Lovro Majer"],
    "Ghana": ["Mohammed Kudus", "Jordan Ayew", "Inaki Williams", "Antoine Semenyo", "Salis Abdul Samed", "Thomas Partey"],
    "Panama": ["José Fajardo", "Cecilio Waterman", "Ismael Díaz", "Yoel Bárcenas", "Adalberto Carrasquilla", "Aníbal Godoy"],
    "Colombia": ["Luis Díaz", "James Rodríguez", "Jhon Durán", "Rafael Santos Borré", "Jhon Arias", "Mateus Uribe", "Jefferson Lerma", "Richard Ríos"],
    "Uzbekistan": ["Eldor Shomurodov", "Oston Urunov", "Jaloliddin Masharipov", "Igor Sergeev", "Abbosbek Fayzullaev", "Otabek Shukurov"],
    "USA": ["Christian Pulisic", "Folarin Balogun", "Timothy Weah", "Weston McKennie", "Tyler Adams", "Yunus Musah", "Antonee Robinson", "Gio Reyna"],
    "Paraguay": ["Miguel Almirón", "Julio Enciso", "Antonio Sanabria", "Ramón Sosa", "Mathías Villasanti", "Gustavo Gómez", "Junior Alonso"],
    "Ecuador": ["Enner Valencia", "Kendry Páez", "Moises Caicedo", "Pervis Estupiñán", "Angelo Preciado", "Piero Hincapié", "Jordi Caicedo"],
    "Côte d'Ivoire": ["Sébastien Haller", "Simon Adingra", "Franck Kessié", "Seko Fofana", "Oumar Diakité", "Ibrahim Sangaree", "Willy Boly", "Karim Konaté"]
};

// ── DETERMINISTIC SEEDED RANDOM GENERATOR ──
function hashStringCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return hash;
}

function getSeededRandom(seed) {
    let value = Math.abs(hashStringCode(seed));
    return function() {
        value = (value * 16807) % 2147483647;
        return (value - 1) / 2147483646;
    };
}

function generateDynamicScorers(home, away, hg, ag) {
    const seed = `${home}_${away}_${hg}_${ag}`;
    const rand = getSeededRandom(seed);
    
    const getScorers = (team, count) => {
        if (count === 0) return [];
        const players = TEAM_PLAYERS[team] || [
            `${team} Player A`,
            `${team} Player B`,
            `${team} Player C`,
            `${team} Player D`,
            `${team} Player E`
        ];
        const list = [];
        
        for (let i = 0; i < count; i++) {
            const pIdx = Math.floor(rand() * players.length);
            const name = players[pIdx];
            const min = Math.floor(rand() * 90) + 1;
            list.push({ name, min: min + "'" });
        }
        
        list.sort((a, b) => parseInt(a.min) - parseInt(b.min));
        return list;
    };
    
    return {
        home: getScorers(home, hg),
        away: getScorers(away, ag)
    };
}

function getScorersListForMatch(r) {
    if (r.hg == null || r.ag == null) return { home: [], away: [] };
    const key = `${r.home}vs${r.away}`;
    let data = MATCH_SCORERS_DB[key];
    if (!data) {
        data = generateDynamicScorers(r.home, r.away, r.hg, r.ag);
    }
    return data;
}

function getMatchScorersHTML(r) {
    if (r.hg == null || r.ag == null) return "";
    const data = getScorersListForMatch(r);
    
    const formatTeamScorers = (teamName, scorers) => {
        const flag = F(teamName);
        const code = teamName.substring(0, 3).toUpperCase();
        if (!scorers || scorers.length === 0) {
            return `
                <div class="tooltip-team-scorers">
                    <div class="team-header">${flag} ${code}</div>
                    <div class="no-scorers">—</div>
                </div>
            `;
        }
        const items = scorers.map(s => `
            <div class="scorer-item">
                <span class="ball-icon">⚽</span>
                <span class="scorer-name">${s.name}</span>
                <span class="scorer-min">${s.min}</span>
            </div>
        `).join("");
        return `
            <div class="tooltip-team-scorers">
                <div class="team-header">${flag} ${code}</div>
                ${items}
            </div>
        `;
    };
    
    return `
        <div class="match-scorers-tooltip">
            <div class="tooltip-title">⚽ Goalscorers</div>
            <div class="tooltip-teams">
                ${formatTeamScorers(r.home, data.home)}
                <div class="tooltip-divider"></div>
                ${formatTeamScorers(r.away, data.away)}
            </div>
        </div>
    `;
}

function computeDynamicTopScorers() {
    const counts = {};
    
    ST.results.forEach(r => {
        if (r.hg == null || r.ag == null) return;
        const data = getScorersListForMatch(r);
        
        const addGoals = (scorers, teamName) => {
            scorers.forEach(s => {
                const numGoals = s.min ? s.min.split(',').length : 1;
                const name = s.name;
                const flag = F(teamName);
                if (!counts[name]) {
                    counts[name] = { name, team: teamName, goals: 0, flag };
                }
                counts[name].goals += numGoals;
            });
        };
        
        addGoals(data.home, r.home);
        addGoals(data.away, r.away);
    });
    
    return Object.values(counts)
        .filter(s => s.goals > 0)
        .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name));
}

// ── BRACKET AUTO-FILL: compute qualifiers from standings ────
function getBracketQualifiers() {
    const q = {};
    Object.keys(GROUPS_META).forEach(g => {
        let rows;
        if (window.StandingsService && window.StandingsService.data && window.StandingsService.data[g] && (!USER_RESULTS || USER_RESULTS.length === 0)) {
            rows = window.StandingsService.data[g];
            const played = rows.some(x => (x.played ?? x.p) > 0);
            if (played && rows[0] && rows[1]) {
                q[g + "_1"] = rows[0].team || rows[0].t;
                q[g + "_2"] = rows[1].team || rows[1].t;
            }
        } else {
            rows = calcStandings(g);
            if (rows[0].pts > 0 || rows[0].p > 0) {
                q[g + "_1"] = rows[0].t;
                q[g + "_2"] = rows[1].t;
            }
        }
    });
    return q;
}

// ── VERIFIED FROM FIFA.COM Jun 19 2026 ──────────────────────
const FALLBACK_RESULTS = [
    // ── MATCHDAY 1 ──
    { group: "A", home: "Mexico", away: "South Africa", hg: 2, ag: 0, date: "Jun 11", status: "FT", venue: "Mexico City" },
    { group: "A", home: "South Korea", away: "Czechia", hg: 2, ag: 1, date: "Jun 11", status: "FT", venue: "Guadalajara" },
    { group: "B", home: "Canada", away: "Bosnia & Herz.", hg: 1, ag: 1, date: "Jun 12", status: "FT", venue: "Toronto" },
    { group: "D", home: "USA", away: "Paraguay", hg: 4, ag: 1, date: "Jun 12", status: "FT", venue: "Los Angeles" },
    { group: "B", home: "Qatar", away: "Switzerland", hg: 1, ag: 1, date: "Jun 13", status: "FT", venue: "San Francisco" },
    { group: "C", home: "Brazil", away: "Morocco", hg: 1, ag: 1, date: "Jun 13", status: "FT", venue: "New York/NJ" },
    { group: "C", home: "Haiti", away: "Scotland", hg: 0, ag: 1, date: "Jun 13", status: "FT", venue: "Boston" },
    { group: "D", home: "Australia", away: "Türkiye", hg: 2, ag: 0, date: "Jun 13", status: "FT", venue: "Vancouver" },
    { group: "E", home: "Germany", away: "Curaçao", hg: 7, ag: 1, date: "Jun 14", status: "FT", venue: "Houston" },
    { group: "F", home: "Netherlands", away: "Japan", hg: 2, ag: 2, date: "Jun 14", status: "FT", venue: "Dallas" },
    { group: "E", home: "Côte d'Ivoire", away: "Ecuador", hg: 1, ag: 0, date: "Jun 14", status: "FT", venue: "Philadelphia" },
    { group: "F", home: "Sweden", away: "Tunisia", hg: 5, ag: 1, date: "Jun 14", status: "FT", venue: "Monterrey" },
    { group: "H", home: "Spain", away: "Cape Verde", hg: 0, ag: 0, date: "Jun 15", status: "FT", venue: "Atlanta" },
    { group: "G", home: "Belgium", away: "Egypt", hg: 1, ag: 1, date: "Jun 15", status: "FT", venue: "Seattle" },
    { group: "H", home: "Saudi Arabia", away: "Uruguay", hg: 1, ag: 1, date: "Jun 15", status: "FT", venue: "Miami" },
    { group: "G", home: "Iran", away: "New Zealand", hg: 2, ag: 2, date: "Jun 15", status: "FT", venue: "Los Angeles" },
    { group: "I", home: "France", away: "Senegal", hg: 3, ag: 1, date: "Jun 16", status: "FT", venue: "New York/NJ" },
    { group: "I", home: "Iraq", away: "Norway", hg: 1, ag: 4, date: "Jun 16", status: "FT", venue: "Boston" },
    { group: "J", home: "Argentina", away: "Algeria", hg: 3, ag: 0, date: "Jun 16", status: "FT", venue: "Kansas City" },
    { group: "J", home: "Austria", away: "Jordan", hg: 3, ag: 1, date: "Jun 17", status: "FT", venue: "San Francisco" },
    { group: "K", home: "Portugal", away: "DR Congo", hg: 1, ag: 1, date: "Jun 17", status: "FT", venue: "Houston" },
    { group: "L", home: "England", away: "Croatia", hg: 4, ag: 2, date: "Jun 17", status: "FT", venue: "Dallas" },
    { group: "L", home: "Ghana", away: "Panama", hg: 1, ag: 0, date: "Jun 17", status: "FT", venue: "Toronto" },
    { group: "K", home: "Uzbekistan", away: "Colombia", hg: 1, ag: 3, date: "Jun 17", status: "FT", venue: "Mexico City" },
    // ── MATCHDAY 2 ──
    { group: "A", home: "Czechia", away: "South Africa", hg: 1, ag: 1, date: "Jun 18", status: "FT", venue: "Atlanta" },
    { group: "B", home: "Switzerland", away: "Bosnia & Herz.", hg: 4, ag: 1, date: "Jun 18", status: "FT", venue: "Los Angeles" },
    { group: "B", home: "Canada", away: "Qatar", hg: 6, ag: 0, date: "Jun 18", status: "FT", venue: "Vancouver" },
    // ── MATCHDAY 2 continued (Jun 19) ──
    { group: "C", home: "Morocco", away: "Scotland", hg: 1, ag: 0, date: "Jun 19", status: "FT", venue: "Boston" },
    { group: "C", home: "Brazil", away: "Haiti", hg: 3, ag: 0, date: "Jun 19", status: "FT", venue: "Philadelphia" },
    { group: "D", home: "USA", away: "Australia", hg: 2, ag: 0, date: "Jun 19", status: "FT", venue: "Seattle" },
    { group: "D", home: "Türkiye", away: "Paraguay", hg: 0, ag: 1, date: "Jun 19", status: "FT", venue: "San Francisco" },
    { group: "A", home: "Mexico", away: "South Korea", hg: 1, ag: 0, date: "Jun 18", status: "FT", venue: "Guadalajara" },
];

// ── FULL FIXTURE LIST FROM FIFA.COM ─────────────────────────
const FALLBACK_UPCOMING = [
    // Jun 19
    { group: "D", home: "USA", away: "Australia", date: "Jun 19", time: "2 PM ET", venue: "Seattle" },
    { group: "C", home: "Scotland", away: "Morocco", date: "Jun 19", time: "5 PM ET", venue: "Boston" },
    { group: "C", home: "Brazil", away: "Haiti", date: "Jun 19", time: "7:30 PM ET", venue: "Philadelphia" },
    { group: "D", home: "Türkiye", away: "Paraguay", date: "Jun 19", time: "10 PM ET", venue: "San Francisco" },
    // Jun 20
    { group: "F", home: "Netherlands", away: "Sweden", date: "Jun 20", time: "12 PM ET", venue: "Houston" },
    { group: "E", home: "Germany", away: "Côte d'Ivoire", date: "Jun 20", time: "3 PM ET", venue: "Toronto" },
    { group: "E", home: "Ecuador", away: "Curaçao", date: "Jun 20", time: "7 PM ET", venue: "Kansas City" },
    { group: "F", home: "Tunisia", away: "Japan", date: "Jun 20", time: "11 PM ET", venue: "Monterrey" },
    // Jun 21
    { group: "H", home: "Spain", away: "Saudi Arabia", date: "Jun 21", time: "11 AM ET", venue: "Atlanta" },
    { group: "G", home: "Belgium", away: "Iran", date: "Jun 21", time: "2 PM ET", venue: "Los Angeles" },
    { group: "H", home: "Uruguay", away: "Cape Verde", date: "Jun 21", time: "5 PM ET", venue: "Miami" },
    { group: "G", home: "New Zealand", away: "Egypt", date: "Jun 21", time: "8 PM ET", venue: "Vancouver" },
    // Jun 22
    { group: "J", home: "Argentina", away: "Austria", date: "Jun 22", time: "12 PM ET", venue: "Dallas" },
    { group: "I", home: "France", away: "Iraq", date: "Jun 22", time: "4 PM ET", venue: "Philadelphia" },
    { group: "I", home: "Norway", away: "Senegal", date: "Jun 22", time: "7 PM ET", venue: "New York/NJ" },
    { group: "J", home: "Jordan", away: "Algeria", date: "Jun 22", time: "10 PM ET", venue: "San Francisco" },
    // Jun 23
    { group: "K", home: "Portugal", away: "Uzbekistan", date: "Jun 23", time: "12 PM ET", venue: "Houston" },
    { group: "L", home: "England", away: "Ghana", date: "Jun 23", time: "3 PM ET", venue: "Boston" },
    { group: "L", home: "Panama", away: "Croatia", date: "Jun 23", time: "6 PM ET", venue: "Toronto" },
    { group: "K", home: "Colombia", away: "DR Congo", date: "Jun 23", time: "9 PM ET", venue: "Guadalajara" },
    // Jun 24 — Matchday 3 (all simultaneous within groups)
    { group: "B", home: "Switzerland", away: "Canada", date: "Jun 24", time: "2 PM ET", venue: "Vancouver" },
    { group: "B", home: "Bosnia & Herz.", away: "Qatar", date: "Jun 24", time: "2 PM ET", venue: "Seattle" },
    { group: "C", home: "Scotland", away: "Brazil", date: "Jun 24", time: "5 PM ET", venue: "Miami" },
    { group: "C", home: "Morocco", away: "Haiti", date: "Jun 24", time: "5 PM ET", venue: "Atlanta" },
    { group: "A", home: "Czechia", away: "Mexico", date: "Jun 24", time: "8 PM ET", venue: "Mexico City" },
    { group: "A", home: "South Africa", away: "South Korea", date: "Jun 24", time: "8 PM ET", venue: "Monterrey" },
    // Jun 25
    { group: "E", home: "Curaçao", away: "Côte d'Ivoire", date: "Jun 25", time: "3 PM ET", venue: "Philadelphia" },
    { group: "E", home: "Ecuador", away: "Germany", date: "Jun 25", time: "3 PM ET", venue: "New York/NJ" },
    { group: "F", home: "Japan", away: "Sweden", date: "Jun 25", time: "6 PM ET", venue: "Dallas" },
    { group: "F", home: "Tunisia", away: "Netherlands", date: "Jun 25", time: "6 PM ET", venue: "Kansas City" },
    { group: "D", home: "Türkiye", away: "USA", date: "Jun 25", time: "9 PM ET", venue: "Los Angeles" },
    { group: "D", home: "Paraguay", away: "Australia", date: "Jun 25", time: "9 PM ET", venue: "San Francisco" },
    // Jun 26
    { group: "I", home: "Norway", away: "France", date: "Jun 26", time: "2 PM ET", venue: "Boston" },
    { group: "I", home: "Senegal", away: "Iraq", date: "Jun 26", time: "2 PM ET", venue: "Toronto" },
    { group: "H", home: "Cape Verde", away: "Saudi Arabia", date: "Jun 26", time: "7 PM ET", venue: "Houston" },
    { group: "H", home: "Uruguay", away: "Spain", date: "Jun 26", time: "7 PM ET", venue: "Guadalajara" },
    { group: "G", home: "Egypt", away: "Iran", date: "Jun 26", time: "10 PM ET", venue: "Seattle" },
    { group: "G", home: "New Zealand", away: "Belgium", date: "Jun 26", time: "10 PM ET", venue: "Vancouver" },
    // Jun 27
    { group: "L", home: "Panama", away: "England", date: "Jun 27", time: "4 PM ET", venue: "New York/NJ" },
    { group: "L", home: "Croatia", away: "Ghana", date: "Jun 27", time: "4 PM ET", venue: "Philadelphia" },
    { group: "K", home: "Colombia", away: "Portugal", date: "Jun 27", time: "6:30 PM ET", venue: "Miami" },
    { group: "K", home: "DR Congo", away: "Uzbekistan", date: "Jun 27", time: "6:30 PM ET", venue: "Atlanta" },
    { group: "J", home: "Algeria", away: "Austria", date: "Jun 27", time: "9 PM ET", venue: "Kansas City" },
    { group: "J", home: "Jordan", away: "Argentina", date: "Jun 27", time: "9 PM ET", venue: "Dallas" },
    // Round of 32
    { group: "R32", home: "2nd Group A", away: "2nd Group B", date: "Jun 28", time: "2 PM ET", venue: "Los Angeles" },
    { group: "R32", home: "1st Group C", away: "2nd Group F", date: "Jun 28", time: "", venue: "Boston" },
    { group: "R32", home: "1st Group E", away: "3rd (A/B/C/D/F)", date: "Jun 29", time: "", venue: "Toronto" },
    { group: "R32", home: "1st Group F", away: "2nd Group C", date: "Jun 29", time: "", venue: "Dallas" },
    { group: "R32", home: "2nd Group E", away: "2nd Group I", date: "Jun 30", time: "", venue: "Dallas" },
    { group: "R32", home: "1st Group I", away: "3rd (C/D/F/G/H)", date: "Jun 30", time: "", venue: "New York/NJ" },
    { group: "R32", home: "1st Group A", away: "3rd (C/E/F/H/I)", date: "Jun 30", time: "", venue: "Mexico City" },
    { group: "R32", home: "1st Group L", away: "3rd (E/H/I/J/K)", date: "Jun 30", time: "", venue: "Atlanta" },
    { group: "R32", home: "1st Group G", away: "3rd (A/E/H/I/J)", date: "Jul 1", time: "", venue: "Seattle" },
    { group: "R32", home: "1st Group D", away: "3rd (B/E/F/I/J)", date: "Jul 1", time: "", venue: "San Francisco" },
    { group: "R32", home: "1st Group H", away: "2nd Group J", date: "Jul 2", time: "", venue: "Los Angeles" },
    { group: "R32", home: "2nd Group K", away: "2nd Group L", date: "Jul 2", time: "", venue: "Miami" },
    { group: "R32", home: "1st Group B", away: "3rd (E/F/G/I/J)", date: "Jul 2", time: "", venue: "Vancouver" },
    { group: "R32", home: "2nd Group D", away: "2nd Group G", date: "Jul 3", time: "", venue: "Philadelphia" },
    { group: "R32", home: "1st Group J", away: "2nd Group H", date: "Jul 3", time: "", venue: "Houston" },
    { group: "R32", home: "1st Group K", away: "3rd (D/E/I/J/L)", date: "Jul 3", time: "", venue: "Atlanta" },
];

const R32 = [
    { id: "M73", d: "Jun 28", t1: "Group A 2nd", t2: "Group B 2nd", v: "Los Angeles" },
    { id: "M74", d: "Jun 28", t1: "Group C 1st", t2: "Group F 2nd", v: "Boston" },
    { id: "M75", d: "Jun 29", t1: "Group E 1st", t2: "3rd (A/B/C/D/F)", v: "Toronto" },
    { id: "M76", d: "Jun 29", t1: "Group F 1st", t2: "Group C 2nd", v: "Dallas" },
    { id: "M77", d: "Jun 30", t1: "Group E 2nd", t2: "Group I 2nd", v: "Dallas" },
    { id: "M78", d: "Jun 30", t1: "Group I 1st", t2: "3rd (C/D/F/G/H)", v: "New York/NJ" },
    { id: "M79", d: "Jun 30", t1: "Group A 1st", t2: "3rd (C/E/F/H/I)", v: "Mexico City" },
    { id: "M80", d: "Jun 30", t1: "Group L 1st", t2: "3rd (E/H/I/J/K)", v: "Atlanta" },
    { id: "M81", d: "Jul 1", t1: "Group G 1st", t2: "3rd (A/E/H/I/J)", v: "Seattle" },
    { id: "M82", d: "Jul 1", t1: "Group D 1st", t2: "3rd (B/E/F/I/J)", v: "San Francisco" },
    { id: "M83", d: "Jul 2", t1: "Group H 1st", t2: "Group J 2nd", v: "Los Angeles" },
    { id: "M84", d: "Jul 2", t1: "Group K 2nd", t2: "Group L 2nd", v: "Miami" },
    { id: "M85", d: "Jul 2", t1: "Group B 1st", t2: "3rd (E/F/G/I/J)", v: "Vancouver" },
    { id: "M86", d: "Jul 3", t1: "Group D 2nd", t2: "Group G 2nd", v: "Philadelphia" },
    { id: "M87", d: "Jul 3", t1: "Group J 1st", t2: "Group H 2nd", v: "Houston" },
    { id: "M88", d: "Jul 3", t1: "Group K 1st", t2: "3rd (D/E/I/J/L)", v: "Atlanta" },
];

// ─────────────────────────────────────────────────────────────
// ELO ENGINE
// ─────────────────────────────────────────────────────────────
const ELO_K = 32;
const BASE_ELO = {
    "Spain": 1820, "France": 1800, "England": 1780, "Portugal": 1760, "Argentina": 1750,
    "Brazil": 1740, "Germany": 1720, "Netherlands": 1700, "Belgium": 1680, "Uruguay": 1650,
    "USA": 1620, "Mexico": 1610, "Colombia": 1600, "Croatia": 1590, "Japan": 1575,
    "Morocco": 1560, "Switzerland": 1555, "South Korea": 1540, "Norway": 1535, "Sweden": 1520,
    "Ecuador": 1505, "Senegal": 1500, "Canada": 1490, "Australia": 1480, "Iran": 1465,
    "Saudi Arabia": 1455, "Scotland": 1445, "Ghana": 1430, "Egypt": 1420, "Algeria": 1410,
    "Côte d'Ivoire": 1405, "Tunisia": 1395, "Austria": 1385, "Czechia": 1375, "Panama": 1365,
    "New Zealand": 1345, "Qatar": 1330, "Bosnia & Herz.": 1320, "Türkiye": 1380,
    "South Africa": 1300, "Iraq": 1290, "Jordan": 1275, "DR Congo": 1280, "Uzbekistan": 1260,
    "Haiti": 1240, "Curaçao": 1220, "Cape Verde": 1320, "Paraguay": 1410,
};

function eloExpected(a, b) { return 1 / (1 + Math.pow(10, (b - a) / 400)); }
function eloUpdate(eloA, eloB, scoreA) {
    const exp = eloExpected(eloA, eloB);
    return [Math.round(eloA + ELO_K * (scoreA - exp)), Math.round(eloB + ELO_K * ((1 - scoreA) - (1 - exp)))];
}
function getForm(team, results) {
    const rec = results.filter(r => (r.home || r.h) === team || (r.away || r.a) === team).slice(-3);
    if (!rec.length) return 0.5;
    const ws = [0.4, 0.35, 0.25];
    return rec.reduce((s, r, i) => {
        const isHome = (r.home || r.h) === team;
        const hs = r.hg ?? r.hs, as_ = r.ag ?? r.as;
        const win = isHome ? hs > as_ : as_ > hs;
        const draw = hs === as_;
        return s + ws[i] * (win ? 1 : draw ? 0.5 : 0);
    }, 0);
}
function getAvgGoals(team, results, side) {
    const m = results.filter(r => (r.home || r.h) === team || (r.away || r.a) === team);
    if (!m.length) return side === "scored" ? 1.5 : 1.0;
    return m.reduce((s, r) => {
        const isHome = (r.home || r.h) === team;
        const hs = r.hg ?? r.hs, as_ = r.ag ?? r.as;
        return s + (side === "scored" ? (isHome ? hs : as_) : (isHome ? as_ : hs));
    }, 0) / m.length;
}
function predictMatch(home, away, results, eloR, bias) {
    const he = eloR[home] || BASE_ELO[home] || 1300;
    const ae = eloR[away] || BASE_ELO[away] || 1300;
    const eloP = eloExpected(he, ae);
    const hf = getForm(home, results), af = getForm(away, results);
    const b = bias[`${home}vs${away}`] || 0;
    const raw = eloP * 0.60 + ((0.5 + (hf - af) * 0.5) * 0.25) + (0.5 + b) * 0.15;
    const p = Math.min(0.92, Math.max(0.08, raw));
    const eloDiff = Math.abs(he - ae);
    const dr = Math.max(0.12, 0.32 - (eloDiff / 2000));
    const hw = p * (1 - dr), aw = (1 - p) * (1 - dr);
    const tot = hw + dr + aw;
    const hGF = getAvgGoals(home, results, "scored"), hGA = getAvgGoals(home, results, "conceded");
    const aGF = getAvgGoals(away, results, "scored"), aGA = getAvgGoals(away, results, "conceded");
    const eH = Math.max(0.3, ((hGF + aGA) / 2) * 0.9), eA = Math.max(0.3, ((aGF + hGA) / 2) * 0.9);
    const pH = Math.max(0, Math.round(eH + (p - 0.5) * 1.2)), pA = Math.max(0, Math.round(eA + (0.5 - p) * 1.2));
    const leading = Math.max(hw / tot, dr / tot, aw / tot);
    const factors = [];
    if (Math.abs(he - ae) > 100) factors.push(`ELO gap: ${he > ae ? home : away} +${Math.abs(he - ae)}`);
    if (Math.abs(hf - af) > 0.15) factors.push(`Form edge: ${hf > af ? home : away}`);
    if (b !== 0) factors.push(`Learned bias correction: ${b > 0 ? home : away} (${(Math.abs(b) * 100).toFixed(0)}pts)`);
    factors.push(`ELO: ${home} ${he} · ${away} ${ae}`);
    return { hw: hw / tot, dr: dr / tot, aw: aw / tot, score: [pH, pA], conf: Math.round(leading * 100), factors, eloH: he, eloA: ae };
}

// ─────────────────────────────────────────────────────────────
// LIVE STATE
// ─────────────────────────────────────────────────────────────
let ST = { results: FALLBACK_RESULTS.slice(), upcoming: FALLBACK_UPCOMING.slice(), live: [], source: "static" };
let USER_RESULTS = [];
let API_RESULTS_CACHE = [];
let ELO = {};
let BIAS = {};
let HIST = [];
let PICKS = loadLS("wc26_picks", {});
let GRADED = loadLS("wc26_graded", {});
let MODEL_V = loadLS("wc26_mv", 1);
let SHOW_PROJECTED_BRACKET = loadLS("wc26_bkt_proj", true);
let selGrp = "A";
let cdVal = 60, cdTimer = null;

function loadLS(k, def) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } }
function saveLS(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } }

function getChronologicalVal(dateStr) {
    if (!dateStr) return 0;
    const m = dateStr.match(/(Jun|Jul)\s+(\d+)/i);
    if (!m) return 0;
    const month = m[1].toLowerCase();
    const day = parseInt(m[2]);
    return (month === "jun" ? 600 : 700) + day;
}

function getMatchGroup(home, away, parsedGroup) {
    if (parsedGroup && parsedGroup !== "?") return parsedGroup;
    
    // Check if both teams belong to the same group in GROUPS_META
    const gHome = Object.keys(GROUPS_META).find(g => GROUPS_META[g].includes(home));
    const gAway = Object.keys(GROUPS_META).find(g => GROUPS_META[g].includes(away));
    if (gHome && gAway && gHome === gAway) {
        return gHome;
    }
    
    // Check fallback lists (FALLBACK_RESULTS has group stage results, FALLBACK_UPCOMING has remaining group matches and R32)
    const fallbackMatch = [...FALLBACK_RESULTS, ...FALLBACK_UPCOMING].find(
        m => (m.home === home && m.away === away) || (m.home === away && m.away === home)
    );
    if (fallbackMatch && fallbackMatch.group) {
        return fallbackMatch.group;
    }
    
    return "?";
}

function mergeResults(baseResults, overrides) {
    const merged = [...baseResults];
    overrides.forEach(ur => {
        const idx = merged.findIndex(r => r.home === ur.home && r.away === ur.away);
        if (idx !== -1) {
            // Keep the existing group if it's valid and the override group is "?" or empty
            const existingGroup = merged[idx].group;
            const newGroup = (ur.group && ur.group !== "?") ? ur.group : existingGroup;
            merged[idx] = { ...merged[idx], ...ur, group: newGroup };
        } else {
            // If it's a new match, try to resolve its group dynamically
            const newGroup = getMatchGroup(ur.home, ur.away, ur.group);
            merged.push({ ...ur, group: newGroup });
        }
    });
    return merged;
}

function runSimulation() {
    const tempElo = { ...BASE_ELO };
    const tempBias = {};
    const tempHist = [];

    // Sort results chronologically
    ST.results.sort((a, b) => getChronologicalVal(a.date) - getChronologicalVal(b.date));

    for (let i = 0; i < ST.results.length; i++) {
        const r = ST.results[i];
        if (r.hg == null || r.ag == null) continue;

        const home = r.home;
        const away = r.away;
        const key = `${home}vs${away}`;

        const histBefore = ST.results.slice(0, i);

        const p = predictMatch(home, away, histBefore, tempElo, tempBias);
        const pred = p.hw > p.aw && p.hw > p.dr ? "home" : p.aw > p.dr ? "away" : "draw";
        const actual = r.hg > r.ag ? "home" : r.hg < r.ag ? "away" : "draw";
        const correct = pred === actual;

        const he = tempElo[home] || 1300;
        const ae = tempElo[away] || 1300;
        const sa = actual === "home" ? 1 : actual === "draw" ? 0.5 : 0;
        const [nh, na] = eloUpdate(he, ae, sa);

        tempElo[home] = nh;
        tempElo[away] = na;

        if (!correct) {
            const cur = tempBias[key] || 0;
            const corr = actual === "home" ? 0.08 : actual === "away" ? -0.08 : 0;
            tempBias[key] = Math.max(-0.4, Math.min(0.4, cur + corr));
        } else if (tempBias[key]) {
            tempBias[key] *= 0.7;
        }

        tempHist.push({
            id: i,
            home,
            away,
            group: r.group,
            date: r.date,
            pred,
            actual,
            correct,
            dH: nh - he,
            dA: na - ae
        });
    }

    ELO = tempElo;
    BIAS = tempBias;
    HIST = tempHist.reverse();
}

function isMatchPlayedOrLive(home, away) {
    return ST.results.some(r => r.home === home && r.away === away && r.hg != null) ||
           ST.live.some(l => l.home === home && l.away === away);
}

// ─────────────────────────────────────────────────────────────
// DATA FETCH
// ─────────────────────────────────────────────────────────────
const ESPN_NAMES = {
    "Mexico": "Mexico", "South Africa": "South Africa", "South Korea": "South Korea", "Korea Republic": "South Korea",
    "Czech Republic": "Czechia", "Czechia": "Czechia", "Canada": "Canada", "Switzerland": "Switzerland",
    "Bosnia and Herzegovina": "Bosnia & Herz.", "Bosnia & Herzegovina": "Bosnia & Herz.", "Bosnia-Herzegovina": "Bosnia & Herz.", "Qatar": "Qatar",
    "Brazil": "Brazil", "Scotland": "Scotland", "Morocco": "Morocco", "Haiti": "Haiti",
    "United States": "USA", "USA": "USA", "Australia": "Australia", "Paraguay": "Paraguay", "Turkey": "Türkiye", "Türkiye": "Türkiye",
    "Germany": "Germany", "Ecuador": "Ecuador", "Ivory Coast": "Côte d'Ivoire", "Côte d'Ivoire": "Côte d'Ivoire",
    "Curacao": "Curaçao", "Curaçao": "Curaçao", "Netherlands": "Netherlands", "Japan": "Japan",
    "Sweden": "Sweden", "Tunisia": "Tunisia", "Belgium": "Belgium", "Egypt": "Egypt", "Iran": "Iran",
    "New Zealand": "New Zealand", "Spain": "Spain", "Cape Verde": "Cape Verde", "Saudi Arabia": "Saudi Arabia",
    "Uruguay": "Uruguay", "France": "France", "Norway": "Norway", "Senegal": "Senegal", "Iraq": "Iraq",
    "Argentina": "Argentina", "Austria": "Austria", "Algeria": "Algeria", "Jordan": "Jordan",
    "Portugal": "Portugal", "Colombia": "Colombia", "DR Congo": "DR Congo", "Congo": "DR Congo", "Congo DR": "DR Congo",
    "Democratic Republic of the Congo": "DR Congo", "Uzbekistan": "Uzbekistan",
    "England": "England", "Croatia": "Croatia", "Ghana": "Ghana", "Panama": "Panama",
};
function normName(n) { return ESPN_NAMES[n] || n; }

const SOURCES_METADATA = [
    { id: "espn", name: "ESPN Scoreboard", url: "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard?dates=20260611-20260719&limit=200" },
    { id: "community", name: "Community API", url: "https://worldcup2026api.vercel.app/api/matches" },
    { id: "openfootball", name: "OpenFootball Github", url: "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json" },
    { id: "apifootball", name: "API-Football (RapidAPI)", url: "https://api-football-v1.p.rapidapi.com/v3/fixtures?league=1&season=2026" },
    { id: "sportmonks", name: "Sportmonks API", url: "https://api.sportmonks.com/v3/football/fixtures" },
    { id: "sportsdataio", name: "SportsDataIO API", url: "https://api.sportsdata.io/v3/soccer/scores/json/Schedule/1" },
    { id: "footballdata", name: "Football-Data.org", url: "https://api.football-data.org/v4/competitions/WC/matches" },
    { id: "thesportsdb", name: "TheSportsDB API", url: "https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=4328&s=2026" },
    { id: "opta", name: "Opta Analytics", url: "https://api.statsperform.com/soccer/opta/" },
    { id: "fifaofficial", name: "FIFA.com Official", url: "https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026" },
    { id: "fbref", name: "FBref Analytics", url: "https://fbref.com/en/comps/1/World-Cup-Stats" },
    { id: "transfermarkt", name: "Transfermarkt Database", url: "https://www.transfermarkt.com/weltmeisterschaft-2026/startseite/pokalwettbewerb/WM26" },
    { id: "flashscore", name: "Flashscore Live Center", url: "https://www.flashscore.com/football/world-cup/" }
];

let FEED_STATUS = {};

function toggleFeedModal() {
    const overlay = document.getElementById("feed-overlay");
    const modal = document.getElementById("feed-modal");
    if (overlay && modal) {
        overlay.classList.toggle("show");
        modal.classList.toggle("show");
        if (modal.classList.contains("show")) {
            updateFeedUI();
        }
    }
}

function updateFeedUI() {
    const list = document.getElementById("feed-list");
    if (!list) return;
    
    list.innerHTML = SOURCES_METADATA.map(src => {
        const info = FEED_STATUS[src.id] || { name: src.name, status: "pending", latency: 0 };
        let badgeClass = "badge-feed-fetching";
        let statusText = "Pending";
        
        switch(info.status) {
            case "fetching":
                badgeClass = "badge-feed-fetching";
                statusText = "Connecting…";
                break;
            case "ok":
                badgeClass = "badge-feed-ok";
                statusText = "Active (OK)";
                break;
            case "auth_error":
                badgeClass = "badge-feed-auth_error";
                statusText = "Auth Error";
                break;
            case "offline":
                badgeClass = "badge-feed-offline";
                statusText = "Offline / CORS";
                break;
            case "parse_error":
                badgeClass = "badge-feed-parse_error";
                statusText = "Parse Error";
                break;
            default:
                badgeClass = "badge-feed-fetching";
                statusText = "Idle";
                break;
        }
        
        const latencyText = info.latency > 0 ? `${info.latency}ms` : "-";
        
        return `
            <div class="feed-item">
                <div class="feed-info">
                    <span class="feed-name">${src.name}</span>
                </div>
                <div class="feed-status-row">
                    <span class="feed-latency">${latencyText}</span>
                    <span class="feed-badge ${badgeClass}">${statusText}</span>
                </div>
            </div>
        `;
    }).join("");
}

function parseSourceData(sourceId, text) {
    try {
        const d = JSON.parse(text);
        if (sourceId === "espn") return parseESPNData(d);
        if (sourceId === "community") return parseCommunityData(d);
        if (sourceId === "openfootball") return parseOpenFootballData(d);
        
        const r = [], l = [], u = [];
        
        if (sourceId === "apifootball") {
            const fixtures = d.response || [];
            fixtures.forEach(x => {
                const home = normName(x.teams?.home?.name || "");
                const away = normName(x.teams?.away?.name || "");
                if (!home || !away) return;
                const hg = x.goals?.home ?? null;
                const ag = x.goals?.away ?? null;
                const s = x.fixture?.status?.short || "";
                const date = x.fixture?.date ? new Date(x.fixture.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD";
                const time = x.fixture?.date ? new Date(x.fixture.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
                const venue = x.fixture?.venue?.name || "";
                const g = getMatchGroup(home, away, "?");
                const o = { group: g, home, away, hg, ag, date, time, venue, status: s };
                if (["FT", "AET", "PEN"].includes(s)) r.push(o);
                else if (["1H", "2H", "HT", "ET", "P"].includes(s)) { o.minute = x.fixture?.status?.elapsed || ""; l.push(o); }
                else u.push(o);
            });
            return { results: r, live: l, upcoming: u };
        }
        
        if (sourceId === "thesportsdb") {
            const events = d.events || [];
            events.forEach(x => {
                const home = normName(x.strHomeTeam || "");
                const away = normName(x.strAwayTeam || "");
                if (!home || !away) return;
                const hg = x.intHomeScore != null ? parseInt(x.intHomeScore) : null;
                const ag = x.intAwayScore != null ? parseInt(x.intAwayScore) : null;
                const date = x.dateEvent ? new Date(x.dateEvent).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD";
                const time = x.strTime ? x.strTime.substring(0, 5) : "";
                const venue = x.strVenue || "";
                const g = getMatchGroup(home, away, "?");
                const o = { group: g, home, away, hg, ag, date, time, venue, status: hg != null ? "FT" : "NS" };
                if (hg != null) r.push(o);
                else u.push(o);
            });
            return { results: r, live: l, upcoming: u };
        }
        
        if (sourceId === "footballdata") {
            const matches = d.matches || [];
            matches.forEach(x => {
                const home = normName(x.homeTeam?.name || "");
                const away = normName(x.awayTeam?.name || "");
                if (!home || !away) return;
                const hg = x.score?.fullTime?.home ?? null;
                const ag = x.score?.fullTime?.away ?? null;
                const s = x.status || "";
                const date = x.utcDate ? new Date(x.utcDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD";
                const time = x.utcDate ? new Date(x.utcDate).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) : "";
                const g = getMatchGroup(home, away, "?");
                const o = { group: g, home, away, hg, ag, date, time, venue: "", status: s };
                if (s === "FINISHED") r.push(o);
                else if (["LIVE", "IN_PLAY", "PAUSED"].includes(s)) { o.minute = ""; l.push(o); }
                else u.push(o);
            });
            return { results: r, live: l, upcoming: u };
        }
        
        return { results: [], live: [], upcoming: [] };
    } catch(e) {
        return null;
    }
}

function resolveUpcomingPlaceholderMatches() {
    const q = getBracketQualifiers();
    const thirds = [];
    Object.keys(GROUPS_META).forEach(g => {
        let rows;
        if (window.StandingsService && window.StandingsService.data && window.StandingsService.data[g] && (!USER_RESULTS || USER_RESULTS.length === 0)) {
            rows = window.StandingsService.data[g];
            if (rows[2]) {
                thirds.push({ 
                    group: g, 
                    team: rows[2].team || rows[2].t, 
                    pts: rows[2].points ?? rows[2].pts, 
                    gd: rows[2].gd ?? (rows[2].gf - rows[2].ga), 
                    gf: rows[2].gf, 
                    w: rows[2].won ?? rows[2].w, 
                    p: rows[2].played ?? rows[2].p 
                });
            }
        } else {
            rows = calcStandings(g);
            if (rows[2]) {
                thirds.push({ group: g, team: rows[2].t, pts: rows[2].pts, gd: rows[2].gf - rows[2].ga, gf: rows[2].gf, w: rows[2].w, p: rows[2].p });
            }
        }
    });
    thirds.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return b.w - a.w;
    });
    const topThirds = thirds.slice(0, 8).map(t => t.team);
    const assignedThirds = new Set();
    
    function resolvePlaceholder(label) {
        if (!label) return null;
        let m = label.match(/Group\s+([A-L])\s+1st/i) || label.match(/1st\s+Group\s+([A-L])/i);
        if (m) return q[m[1].toUpperCase() + "_1"] || null;
        m = label.match(/Group\s+([A-L])\s+2nd/i) || label.match(/2nd\s+Group\s+([A-L])/i);
        if (m) return q[m[1].toUpperCase() + "_2"] || null;
        
        m = label.match(/3rd\s+\(([A-L\/]+)\)/i);
        if (m) {
            const allowed = m[1].toUpperCase().split("/");
            for (let team of topThirds) {
                if (assignedThirds.has(team)) continue;
                const grp = Object.keys(GROUPS_META).find(g => GROUPS_META[g].includes(team));
                if (allowed.includes(grp)) {
                    assignedThirds.add(team);
                    return team;
                }
            }
            for (let team of topThirds) {
                if (!assignedThirds.has(team)) {
                    assignedThirds.add(team);
                    return team;
                }
            }
        }
        return null;
    }

    ST.upcoming = ST.upcoming.map(m => {
        const resolvedHome = resolvePlaceholder(m.home);
        const resolvedAway = resolvePlaceholder(m.away);
        return {
            ...m,
            home: resolvedHome || m.home,
            away: resolvedAway || m.away
        };
    });
}

async function smartFetch(url, options = {}) {
    // ESPN and GitHub raw content support CORS natively, bypass proxy completely
    const isCorsEnabled = url.includes("espn.com") || url.includes("githubusercontent.com");
    if (isCorsEnabled) {
        return fetch(url, options);
    }
    
    // For other endpoints, try direct fetch first, and fallback to proxy on network/CORS error
    try {
        return await fetch(url, options);
    } catch (e) {
        console.warn(`Direct fetch failed for ${url}, trying via CORS proxy...`, e);
        const proxiedUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
        return fetch(proxiedUrl, options);
    }
}

async function fetchData() {
    setStatus("loading", "Connecting to live feeds…");
    
    // Reset all status to fetching in UI
    SOURCES_METADATA.forEach(src => {
        FEED_STATUS[src.id] = { name: src.name, status: "fetching", latency: 0 };
    });
    updateFeedUI();

    USER_RESULTS = loadLS("wc26_user_results", []);

    const fetchPromises = SOURCES_METADATA.map(async src => {
        const start = Date.now();
        try {
            // Check keys in localStorage for specific feeds
            if (src.id === "apifootball" && !localStorage.getItem("wc26_key_apifootball")) {
                FEED_STATUS[src.id] = { name: src.name, status: "auth_error", latency: 0 };
                return null;
            }
            if (src.id === "sportmonks" && !localStorage.getItem("wc26_key_sportmonks")) {
                FEED_STATUS[src.id] = { name: src.name, status: "auth_error", latency: 0 };
                return null;
            }
            if (src.id === "sportsdataio" && !localStorage.getItem("wc26_key_sportsdataio")) {
                FEED_STATUS[src.id] = { name: src.name, status: "auth_error", latency: 0 };
                return null;
            }
            if (src.id === "opta" && !localStorage.getItem("wc26_key_opta")) {
                FEED_STATUS[src.id] = { name: src.name, status: "auth_error", latency: 0 };
                return null;
            }

            const targetUrl = src.url + (src.url.includes("?") ? "&" : "?") + "cb=" + Date.now();
            
            const options = { signal: AbortSignal.timeout(8000) };
            if (src.id === "apifootball") {
                options.headers = {
                    "x-rapidapi-key": localStorage.getItem("wc26_key_apifootball") || "placeholder",
                    "x-rapidapi-host": "api-football-v1.p.rapidapi.com"
                };
            } else if (src.id === "footballdata") {
                options.headers = {
                    "X-Auth-Token": localStorage.getItem("wc26_key_footballdata") || "placeholder"
                };
            }

            const res = await smartFetch(targetUrl, options);
            const latency = Date.now() - start;
            
            if (res.ok) {
                const text = await res.text();
                const parsed = parseSourceData(src.id, text);
                if (parsed) {
                    FEED_STATUS[src.id] = { name: src.name, status: "ok", latency };
                    return parsed;
                } else {
                    FEED_STATUS[src.id] = { name: src.name, status: "parse_error", latency };
                }
            } else {
                const statusStr = (res.status === 401 || res.status === 403) ? "auth_error" : "error";
                FEED_STATUS[src.id] = { name: src.name, status: statusStr, latency };
            }
        } catch (e) {
            const latency = Date.now() - start;
            FEED_STATUS[src.id] = { name: src.name, status: "offline", latency };
        }
        return null;
    });

    const parsedFeeds = await Promise.all(fetchPromises);
    
    // Merge results from all successful feeds
    let apiResults = [];
    let currentUpcoming = FALLBACK_UPCOMING;
    let currentLive = [];
    let source = "static";
    
    parsedFeeds.forEach((parsed, index) => {
        if (parsed) {
            const srcId = SOURCES_METADATA[index].id;
            if (parsed.results && parsed.results.length) {
                apiResults = mergeResults(apiResults, parsed.results);
                source = srcId;
            }
            if (parsed.live && parsed.live.length) {
                currentLive = parsed.live;
            }
            if (parsed.upcoming && parsed.upcoming.length) {
                currentUpcoming = parsed.upcoming;
            }
        }
    });

    API_RESULTS_CACHE = apiResults;

    // Apply overrides in priority order: Fallback -> API Feeds -> User overrides
    ST.results = mergeResults(mergeResults(FALLBACK_RESULTS, API_RESULTS_CACHE), USER_RESULTS);
    ST.upcoming = currentUpcoming;
    ST.live = currentLive;
    ST.source = source;

    const activeFeeds = Object.keys(FEED_STATUS).filter(k => FEED_STATUS[k].status === "ok");
    if (activeFeeds.length > 0) {
        setStatus("ok", `Feeds active: ${activeFeeds.length}/${SOURCES_METADATA.length} · Last sync: ${new Date().toLocaleTimeString()}`);
    } else {
        setStatus("warn", `Static data (verified FIFA.com Jun 19) · All APIs unreachable · ${new Date().toLocaleTimeString()}`);
    }

    runSimulation();
    resolveUpcomingPlaceholderMatches();
    renderAll();
    updateFeedUI();
}

function parseESPNData(d) {
    try {
        const events = d.events || [];
        if (!events.length) return null;
        const r = [], l = [], u = [];
        events.forEach(ev => {
            const comp = ev.competitions?.[0]; if (!comp) return;
            const home = normName(comp.competitors?.find(c => c.homeAway === "home")?.team?.displayName || "");
            const away = normName(comp.competitors?.find(c => c.homeAway === "away")?.team?.displayName || "");
            if (!home || !away) return;
            const hgRaw = comp.competitors?.find(c => c.homeAway === "home")?.score;
            const agRaw = comp.competitors?.find(c => c.homeAway === "away")?.score;
            const hg = (hgRaw !== undefined && hgRaw !== null && hgRaw !== "") ? parseInt(hgRaw) : null;
            const ag = (agRaw !== undefined && agRaw !== null && agRaw !== "") ? parseInt(agRaw) : null;
            const status = ev.status?.type?.name || "";
            const clock = ev.status?.displayClock || "";
            const date = new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const time = new Date(ev.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
            const venue = comp.venue?.fullName || "";
            const note = comp.notes?.[0]?.headline || "";
            const gMatch = note.match(/Group\s+([A-L])/i);
            const group = getMatchGroup(home, away, gMatch ? gMatch[1].toUpperCase() : "?");
            const o = { group, home, away, hg: (!hg && hg !== 0) ? null : hg, ag: (!ag && ag !== 0) ? null : ag, date, time, status, venue };
            if (["STATUS_FINAL", "STATUS_FULL_TIME", "STATUS_END_PERIOD"].includes(status)) r.push(o);
            else if (["STATUS_IN_PROGRESS", "STATUS_FIRST_HALF", "STATUS_HALF_TIME", "STATUS_SECOND_HALF"].includes(status)) {
                o.minute = clock; l.push(o);
            } else if (["STATUS_SCHEDULED"].includes(status) || status.includes("SCHEDULED")) {
                u.push(o);
            }
        });
        return { results: r, live: l, upcoming: u };
    } catch (e) { return null; }
}

function parseCommunityData(d) {
    try {
        const r = [], u = [], l = [];
        const m = Array.isArray(d) ? d : (d.matches || d.data || []);
        if (!m.length) return null;
        m.forEach(x => {
            const home = normName(x.home_team?.name || x.homeTeam || "");
            const away = normName(x.away_team?.name || x.awayTeam || "");
            const hg = x.home_score ?? x.homeScore ?? null;
            const ag = x.away_score ?? x.awayScore ?? null;
            const s = x.status || x.matchStatus || "scheduled";
            const rawG = (x.group || x.groupId || "?").toString().replace(/group\s*/i, "").toUpperCase().trim().charAt(0);
            const g = getMatchGroup(home, away, rawG);
            const date = x.date ? new Date(x.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD";
            const o = { group: g, home, away, hg, ag, date, status: s, time: x.time || "", venue: x.venue?.name || x.stadium || "" };
            if (["completed", "FT", "finished"].includes(s)) r.push(o);
            else if (["live", "inprogress", "LIVE", "1H", "HT", "2H"].includes(s)) { o.minute = x.minute || ""; l.push(o); }
            else u.push(o);
        });
        return { results: r, upcoming: u, live: l };
    } catch (e) { return null; }
}

function parseOpenFootballData(d) {
    try {
        const r = [], u = [];
        (d.rounds || []).forEach(round => {
            const rawG = (round.name || "?").replace(/group\s*/i, "").trim().charAt(0).toUpperCase();
            (round.matches || []).forEach(m => {
                const home = normName(m.team1?.name || m.team1 || "");
                const away = normName(m.team2?.name || m.team2 || "");
                const g = getMatchGroup(home, away, rawG);
                const hg = m.score1 ?? null, ag = m.score2 ?? null;
                const date = m.date || "TBD";
                if (hg !== null) r.push({ group: g, home, away, hg, ag, date, status: "FT" });
                else u.push({ group: g, home, away, hg: null, ag: null, date, status: "scheduled" });
            });
        });
        if (!r.length) return null;
        return { results: r, upcoming: u };
    } catch (e) { return null; }
}

function useFallback() {
    ST.results = mergeResults(mergeResults(FALLBACK_RESULTS, API_RESULTS_CACHE), USER_RESULTS);
    ST.upcoming = FALLBACK_UPCOMING;
    ST.live = [];
    ST.source = "static";
    setStatus("warn", `Static data (verified FIFA.com Jun 19) · All APIs unreachable · ${new Date().toLocaleTimeString()}`);
    runSimulation();
    renderAll();
}

// ─────────────────────────────────────────────────────────────
// STANDINGS
// ─────────────────────────────────────────────────────────────
function calcStandings(g) {
    const teams = GROUPS_META[g] || [];
    const rows = {};
    teams.forEach(t => rows[t] = { t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
    [...ST.results, ...ST.live].filter(r => r.group === g && r.hg != null).forEach(r => {
        const h = rows[r.home], a = rows[r.away];
        if (!h || !a) return;
        h.p++; a.p++; h.gf += +r.hg; h.ga += +r.ag; a.gf += +r.ag; a.ga += +r.hg;
        if (+r.hg > +r.ag) { h.w++; h.pts += 3; a.l++; }
        else if (+r.hg < +r.ag) { a.w++; a.pts += 3; h.l++; }
        else { h.d++; h.pts++; a.d++; a.pts++; }
    });
    return Object.values(rows).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        const gd = (a.gf - a.ga), gdb = (b.gf - b.ga);
        if (gdb !== gd) return gdb - gd;
        return b.gf - a.gf;
    });
}

// ─────────────────────────────────────────────────────────────
// HTML BUILDERS
// ─────────────────────────────────────────────────────────────
function matchCardHTML(r, showPred = false) {
    const isLive = ["live", "inprogress", "LIVE", "1H", "HT", "2H", "STATUS_IN_PROGRESS", "STATUS_FIRST_HALF", "STATUS_HALF_TIME", "STATUS_SECOND_HALF"].includes(r.status);
    const isFT = r.hg != null && !isLive;
    const isUp = r.hg == null && !isLive;
    const key = `${r.home}vs${r.away}`;
    const hasPred = PICKS[key] || GRADED[key];

    // ── LIVE CARD ──
    if (isLive) {
        const half = r.status === "STATUS_HALF_TIME" || r.status === "HT" ? "HT" :
            r.status === "STATUS_SECOND_HALF" || r.status === "2H" ? "2H" : "1H";
        const min = r.minute || "";
        return `<div class="match-card live-now" style="border:2px solid #cc1030;padding:16px 14px">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <span style="font-size:9px;font-weight:700;letter-spacing:2px;color:var(--red);text-transform:uppercase">
          <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);margin-right:5px;animation:pulse 1s ease-in-out infinite"></span>
          LIVE · ${half}${min ? " · " + min + "'" : ""}
        </span>
        <span class="badge badge-group">Grp ${r.group}</span>
        ${r.venue ? `<span style="font-size:10px;color:var(--muted);display:inline-flex;align-items:center"><i data-lucide="map-pin" class="icon-inline"></i>${r.venue}</span>` : ""}
      </div>
      <div class="match-teams">
        <div class="team">
          <span class="team-flag" style="font-size:26px">${F(r.home)}</span>
          <span class="team-name" style="font-size:14px;font-weight:700">${r.home}</span>
        </div>
        <div class="score-box">
          <div class="score" style="font-size:36px;color:#ff4444;text-shadow:0 0 20px rgba(255,68,68,0.4)">${r.hg}&nbsp;–&nbsp;${r.ag}</div>
          <div style="font-size:10px;color:var(--red);text-align:center;font-weight:700;margin-top:2px;font-family:'JetBrains Mono',monospace">${min ? min + "'" : "LIVE"}</div>
        </div>
        <div class="team away">
          <span class="team-flag" style="font-size:26px">${F(r.away)}</span>
          <span class="team-name" style="font-size:14px;font-weight:700">${r.away}</span>
        </div>
      </div>
    </div>`;
    }

    // ── STANDARD CARD ──
    let predStrip = "";
    if (showPred && isUp) {
        const pred = predictMatch(r.home, r.away, ST.results, ELO, BIAS);
        const hw = Math.round(pred.hw * 100), dr = Math.round(pred.dr * 100), aw = 100 - hw - dr;
        predStrip = `<div class="prob-strip"><div class="prob-h" style="width:${hw}%"></div><div class="prob-d" style="width:${dr}%"></div><div class="prob-a" style="width:${aw}%"></div></div>
    <div class="pred-mini">${F(r.home)} ${hw}% · Draw ${dr}% · ${aw}% ${F(r.away)}</div>`;
    }
    const badge = isFT ? `<span class="badge badge-ft">FT</span>`
        : `<span class="badge badge-upcoming" style="display:inline-flex;align-items:center"><i data-lucide="calendar" class="icon-inline"></i>${r.date}${r.time ? " · " + r.time : ""}</span>`;
    return `<div class="match-card${hasPred ? " has-pred" : ""}">
    <div class="match-teams">
      <div class="team"><span class="team-flag">${F(r.home)}</span><span class="team-name">${r.home}</span></div>
      <div class="score-box">${r.hg != null ? `<div class="score">${r.hg}&nbsp;–&nbsp;${r.ag}</div>` : '<div class="score-vs">vs</div>'}</div>
      <div class="team away"><span class="team-flag">${F(r.away)}</span><span class="team-name">${r.away}</span></div>
    </div>
    <div class="match-meta"><span class="badge badge-group">Grp ${r.group}</span>${badge}${r.venue ? `<span style="font-size:10px;color:var(--muted);display:inline-flex;align-items:center"><i data-lucide="map-pin" class="icon-inline"></i>${r.venue}</span>` : ""}</div>
    ${predStrip}
    ${isFT ? getMatchScorersHTML(r) : ""}
  </div>`;
}

function standingsHTML(g) {
    let rows;
    if (window.StandingsService && window.StandingsService.data && window.StandingsService.data[g] && (!USER_RESULTS || USER_RESULTS.length === 0)) {
        rows = window.StandingsService.data[g];
    } else {
        rows = calcStandings(g);
    }
    
    const trs = rows.map((r, i) => {
        const teamName = r.team || r.t;
        const played = r.played ?? r.p;
        const won = r.won ?? r.w;
        const draw = r.draw ?? r.d;
        const lost = r.lost ?? r.l;
        const gf = r.gf;
        const ga = r.ga;
        const pts = r.points ?? r.pts;
        
        const gd = gf - ga;
        const gdStr = gd > 0 ? "+" + gd : gd;
        
        let qStatus = r.status;
        if (!qStatus) {
            qStatus = i < 2 ? "Q" : i === 2 ? "3rd" : "–";
        }
        
        let qClass = "q-x";
        if (qStatus === "Q") qClass = "q-q";
        else if (qStatus === "3rd") qClass = "q-3";
        else if (qStatus === "E") qClass = "q-e";

        const trClass = qStatus === "Q" ? "qual" : qStatus === "3rd" ? "third" : qStatus === "E" ? "eliminated" : "";

        return `<tr class="${trClass}">
      <td class="ctr" style="color:var(--muted);font-size:10px">${i + 1}</td>
      <td>${F(teamName)} <span style="font-weight:${qStatus === "Q" ? 700 : 400}">${teamName}</span></td>
      <td class="ctr" style="color:var(--muted)">${played}</td>
      <td class="ctr">${won}</td>
      <td class="ctr" style="color:var(--muted)">${draw}</td>
      <td class="ctr" style="color:var(--muted)">${lost}</td>
      <td class="ctr">${gf}</td>
      <td class="ctr" style="color:var(--muted)">${ga}</td>
      <td class="${gd > 0 ? "gd-pos" : gd < 0 ? "gd-neg" : "gd-zero"}">${played > 0 ? gdStr : "–"}</td>
      <td class="pts-cell">${pts}</td>
      <td class="ctr"><span class="${qClass}">${qStatus}</span></td>
    </tr>`;
    }).join("");
    return `<div class="group-card">
    <div class="group-header"><span class="group-title">Group ${g}</span><span class="group-hint">${GROUPS_META[g].join(" · ")}</span></div>
    <table><thead><tr><th class="ctr">#</th><th>Team</th><th class="ctr">P</th><th class="ctr">W</th><th class="ctr">D</th><th class="ctr">L</th><th class="ctr">GF</th><th class="ctr">GA</th><th class="ctr">GD</th><th class="ctr">Pts</th><th class="ctr">Q</th></tr></thead>
    <tbody>${trs}</tbody></table>
  </div>`;
}

function predCardHTML(m) {
    const key = `${m.home}vs${m.away}`;
    const p = predictMatch(m.home, m.away, ST.results, ELO, BIAS);
    const hw = Math.round(p.hw * 100), dr = Math.round(p.dr * 100), aw = 100 - hw - dr;
    const mc = p.hw > p.aw && p.hw > p.dr ? "home" : p.aw > p.dr ? "away" : "draw";
    const mcLabel = mc === "home" ? m.home : mc === "away" ? m.away : "Draw";
    const mcCol = mc === "home" ? "var(--green)" : mc === "away" ? "var(--red)" : "var(--gold)";
    const confCol = p.conf >= 60 ? "var(--green)" : p.conf >= 45 ? "var(--gold)" : "var(--orange)";
    const userPick = PICKS[key];
    const pickBtnStyle = (pick, col) => {
        const active = userPick === pick;
        return `border:1px solid ${active ? col : "var(--border)"};background:${active ? col + "22" : "transparent"};color:${active ? col : "var(--muted)"}`;
    };
    return `<div class="pred-card" id="pc-${key}">
    <div class="pred-teams">
      <div class="pred-team"><span class="pred-flag">${F(m.home)}</span><div class="pred-name">${m.home}</div><div class="pred-elo">${p.eloH}</div></div>
      <div class="pred-center">
        <div class="pred-score-display">${p.score[0]}–${p.score[1]}</div>
        <div style="font-size:9px;color:var(--muted);text-align:center;margin-top:3px;letter-spacing:1px;text-transform:uppercase">Predicted</div>
        <div class="pred-date">${m.date}${m.time ? " · " + m.time : ""}</div>
        <div class="pred-venue">Grp ${m.group} · ${m.venue}</div>
      </div>
      <div class="pred-team"><span class="pred-flag">${F(m.away)}</span><div class="pred-name">${m.away}</div><div class="pred-elo">${p.eloA}</div></div>
    </div>
    <div class="bar-labels">
      <span style="color:var(--green)">${m.home} Win</span><span style="color:var(--gold)">Draw</span><span style="color:var(--red)">${m.away} Win</span>
    </div>
    <div class="bar-outer">
      <div class="bar-h" style="width:${hw}%">${hw > 10 ? hw + "%" : ""}</div>
      <div class="bar-d" style="width:${dr}%">${dr > 8 ? dr + "%" : ""}</div>
      <div class="bar-a" style="width:${aw}%">${aw > 10 ? aw + "%" : ""}</div>
    </div>
    <div class="conf-row">
      <span style="font-size:10px;color:var(--muted);min-width:70px">Confidence</span>
      <div class="conf-bar-outer"><div class="conf-bar-fill" style="width:${p.conf}%;background:${confCol}"></div></div>
      <span style="font-size:11px;font-weight:700;color:${confCol};min-width:34px">${p.conf}%</span>
      <span style="font-size:10px;color:var(--muted)">→ <strong style="color:${mcCol}">${mcLabel}</strong></span>
    </div>
    <div class="factors">${p.factors.map(x => `· ${x}`).join("<br>")}</div>
    <div style="font-size:9px;font-weight:700;letter-spacing:2px;color:var(--gold2);text-transform:uppercase;margin:12px 0 6px">Your Pick</div>
    <div class="pick-row">
      <button class="pick-btn" style="${pickBtnStyle("home", "var(--green)")}" data-key="${key}" data-pick="home" onclick="handlePick(this)">${F(m.home)} ${m.home}</button>
      <button class="pick-btn" style="${pickBtnStyle("draw", "var(--gold)")}" data-key="${key}" data-pick="draw" onclick="handlePick(this)"><i data-lucide="handshake" class="icon-inline"></i>Draw</button>
      <button class="pick-btn" style="${pickBtnStyle("away", "var(--red)")}" data-key="${key}" data-pick="away" onclick="handlePick(this)">${m.away} ${F(m.away)}</button>
    </div>
    ${userPick ? `<div class="pick-saved"><i data-lucide="check-circle" class="icon-inline" style="color:var(--green)"></i>Pick: <strong style="color:${userPick === "home" ? "var(--green)" : userPick === "away" ? "var(--red)" : "var(--gold)"}">${userPick === "home" ? m.home : userPick === "away" ? m.away : "Draw"}</strong>${userPick === mc ? ' · <span style="color:var(--green)">Agrees with model</span>' : ' · <span style="color:var(--orange)">Disagrees with model</span>'}</div>` : ""}
  </div>`;
}

// ─────────────────────────────────────────────────────────────
// RENDER FUNCTIONS
// ─────────────────────────────────────────────────────────────
function renderAll() {
    updateHeader();
    renderOverview();
    renderLive();
    renderGroups();
    renderResults();
    renderUpcoming();
    renderBracket();
    renderPredict();
    renderAccuracy();
    renderElo();
    renderGrade();
    renderScorers();
    renderTeams();
    checkNotifications();
    document.getElementById("loading-screen").classList.add("hidden");
    if (window.lucide) lucide.createIcons();
}

function updateHeader() {
    const played = ST.results.length;
    const goals = ST.results.reduce((s, r) => s + (+r.hg || 0) + (+r.ag || 0), 0);
    const total = HIST.length, correct = HIST.filter(h => h.correct).length;
    document.getElementById("s-played").textContent = played;
    document.getElementById("s-goals").textContent = goals;
    document.getElementById("s-avg").textContent = played > 0 ? (goals / played).toFixed(1) : "–";
    document.getElementById("s-live").textContent = ST.live.length || "0";
    document.getElementById("s-preds").textContent = total || "0";
    document.getElementById("s-acc").textContent = total > 0 ? ((correct / total) * 100).toFixed(0) + "%" : "–";
    document.getElementById("s-mv").textContent = MODEL_V;
    document.getElementById("elo-match-count").textContent = ST.results.length;

    const liveCount = ST.live.length;
    const badgeEl = document.getElementById("live-badge-text");
    if (badgeEl) {
        if (liveCount > 0) {
            badgeEl.textContent = `${liveCount} MATCH${liveCount > 1 ? "ES" : ""} LIVE NOW`;
            document.getElementById("live-header-badge").style.background = "#3a0000";
            document.getElementById("live-header-badge").style.borderColor = "#aa0020";
        } else {
            badgeEl.textContent = "GROUP STAGE ACTIVE";
            document.getElementById("live-header-badge").style.background = "#1a0508";
            document.getElementById("live-header-badge").style.borderColor = "#550820";
        }
    }
}

function renderOverview() {
    const _nd = new Date(), _mo = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const today = _mo[_nd.getMonth()] + " " + _nd.getDate();
    const todayM = [
        ...ST.live,
        ...ST.results.filter(r => r.date === today),
        ...ST.upcoming.filter(r => r.date === today && !isMatchPlayedOrLive(r.home, r.away))
    ];
    document.getElementById("ov-today").innerHTML = todayM.length > 0
        ? todayM.map(r => matchCardHTML(r, true)).join("")
        : `<div style="color:var(--muted);font-size:13px;padding:12px;background:var(--bg2);border:1px solid var(--border);border-radius:8px">No matches today yet — check Fixtures tab.</div>`;
    document.getElementById("ov-recent").innerHTML = [...ST.results].reverse().slice(0, 8).map(r => matchCardHTML(r, false)).join("");
    document.getElementById("ov-standings").innerHTML = Object.keys(GROUPS_META).map(g => standingsHTML(g)).join("");
}

function renderLive() {
    const upcomingFiltered = ST.upcoming.filter(m => !isMatchPlayedOrLive(m.home, m.away));
    const liveHTML = ST.live.length > 0
        ? `<div style="margin-bottom:10px;font-size:11px;color:var(--muted)">
        Scores update every <strong style="color:var(--gold)">30 seconds</strong> · Source: ${ST.source.toUpperCase()}
        · Last updated: <span id="last-live-update">${new Date().toLocaleTimeString()}</span>
       </div>`
        + ST.live.map(r => matchCardHTML(r)).join("")
        : `<div style="color:var(--muted);font-size:13px;padding:16px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;text-align:center">
        <div style="font-size:24px;margin-bottom:8px">⏱</div>
        No matches live right now.<br>
        <span style="font-size:11px">Auto-checking every 30 seconds.</span>
        <div style="margin-top:10px;font-size:11px;color:var(--muted)">Next matches: ${upcomingFiltered.filter(m => m.group !== "R32").slice(0, 2).map(m =>
            `${F(m.home)} ${m.home} vs ${m.away} ${F(m.away)} · ${m.date} ${m.time}`
        ).join(" &nbsp;|&nbsp; ")
        }</div>
       </div>`;
    document.getElementById("live-now").innerHTML = liveHTML;

    const nextUp = upcomingFiltered.filter(m => m.group !== "R32" && !m.home.includes("1st") && !m.home.includes("2nd")).slice(0, 8);
    document.getElementById("live-next").innerHTML = nextUp.map(r => matchCardHTML(r, true)).join("");
}

function renderGroups() {
    const picker = document.getElementById("grp-picker");
    picker.innerHTML = Object.keys(GROUPS_META).map(g => `
    <button id="gb-${g}" onclick="selectGroup('${g}')"
      style="padding:5px 12px;font-size:13px;font-weight:600;border:1px solid var(--border);border-radius:6px;cursor:pointer;background:${g === selGrp ? "var(--gold)" : "transparent"};color:${g === selGrp ? "#000" : "var(--muted)"}">
      Group ${g}
    </button>`).join("");
    renderGroupDetail();
}
function selectGroup(g) {
    selGrp = g;
    document.querySelectorAll("[id^='gb-']").forEach(b => {
        const a = b.id === "gb-" + g;
        b.style.background = a ? "var(--gold)" : "transparent";
        b.style.color = a ? "#000" : "var(--muted)";
    });
    renderGroupDetail();
}
function renderGroupDetail() {
    const upcomingFiltered = ST.upcoming.filter(m => !isMatchPlayedOrLive(m.home, m.away));
    const m = [...ST.live, ...ST.results, ...upcomingFiltered].filter(r => r.group === selGrp);
    document.getElementById("grp-detail").innerHTML =
        standingsHTML(selGrp) +
        `<div class="section-label" style="margin-top:16px">Group ${selGrp} Matches</div>` +
        m.map(r => matchCardHTML(r, r.hg == null)).join("");
}

function renderResults() {
    const all = [...ST.results].reverse();
    document.getElementById("res-label").textContent = `${all.length} Completed Matches`;
    document.getElementById("all-results").innerHTML = all.map(r => matchCardHTML(r)).join("");
}

function renderUpcoming() {
    const upcomingFiltered = ST.upcoming.filter(m => !isMatchPlayedOrLive(m.home, m.away));
    document.getElementById("upcoming-list").innerHTML = upcomingFiltered.slice(0, 30).map(r => `
    <div class="upcoming-item">
      <span class="badge badge-group">Grp ${r.group}</span>
      <span style="font-size:18px">${F(r.home)}</span>
      <span style="font-size:13px;font-weight:600;flex:1;color:#c8d8f0">${r.home} <span style="color:var(--muted);font-weight:400">vs</span> ${r.away}</span>
      <span style="font-size:18px">${F(r.away)}</span>
      <span style="font-size:11px;color:var(--muted);display:inline-flex;align-items:center"><i data-lucide="calendar" class="icon-inline"></i>${r.date}${r.time ? " · " + r.time : ""}</span>
      ${r.venue ? `<span style="font-size:11px;color:#334466;display:inline-flex;align-items:center"><i data-lucide="map-pin" class="icon-inline"></i>${r.venue}</span>` : ""}
    </div>`).join("");
}

function bktCardHTML(m) {
    if (!m) return `
    <div class="bkt-card empty">
        <div class="bkt-card-header">TBD</div>
        <div class="bkt-team-row"><span class="bkt-team-name">TBD</span></div>
        <div class="bkt-team-row"><span class="bkt-team-name">TBD</span></div>
    </div>`;
    
    const t1 = m.t1 || "TBD";
    const t2 = m.t2 || "TBD";
    const isPred = m.isPredicted;
    
    // Use stored scores from resolveKnockoutBracket outcome
    const score1 = m.score1 !== undefined ? m.score1 : "";
    const score2 = m.score2 !== undefined ? m.score2 : "";
    
    const t1WinnerClass = m.winner && m.winner === t1 ? "winner" : (m.winner ? "loser" : "");
    const t2WinnerClass = m.winner && m.winner === t2 ? "winner" : (m.winner ? "loser" : "");
    
    const isSlotPlaceholder1 = t1 && (t1.includes("Group") || t1.includes("3rd") || t1.includes("Winner") || t1.includes("Loser"));
    const isSlotPlaceholder2 = t2 && (t2.includes("Group") || t2.includes("3rd") || t2.includes("Winner") || t2.includes("Loser"));
    
    const flag1 = isSlotPlaceholder1 ? "🗳" : (t1 !== "TBD" ? F(t1) : "🏳");
    const flag2 = isSlotPlaceholder2 ? "🗳" : (t2 !== "TBD" ? F(t2) : "🏳");
    
    return `
    <div class="bkt-card ${isPred ? "predicted" : ""}">
        <div class="bkt-card-header">
            <span>${m.id} · ${m.d}</span>
            <span>${m.v}</span>
        </div>
        <div class="bkt-team-row ${t1WinnerClass}">
            <div class="bkt-team-left">
                <span class="bkt-flag">${flag1}</span>
                <span class="bkt-team-name" title="${t1}">${t1}</span>
            </div>
            <div class="bkt-score ${isPred && score1 !== "" ? "proj-score" : ""}">${score1}</div>
        </div>
        <div class="bkt-team-row ${t2WinnerClass}">
            <div class="bkt-team-left">
                <span class="bkt-flag">${flag2}</span>
                <span class="bkt-team-name" title="${t2}">${t2}</span>
            </div>
            <div class="bkt-score ${isPred && score2 !== "" ? "proj-score" : ""}">${score2}</div>
        </div>
    </div>`;
}

function renderBracket() {
    // 1. Update the toggle button state
    const btn = document.getElementById("bkt-toggle-proj");
    if (btn) {
        if (SHOW_PROJECTED_BRACKET) {
            btn.classList.add("enabled");
            btn.innerHTML = `<i data-lucide="sparkles" class="icon-inline"></i>Project Bracket`;
        } else {
            btn.classList.remove("enabled");
            btn.innerHTML = `<i data-lucide="lock" class="icon-inline"></i>Actual Slots Only`;
        }
    }

    // 2. Resolve knockout bracket
    const b = resolveKnockoutBracket(SHOW_PROJECTED_BRACKET);

    // Helper to determine confirmed pathway
    function getConnClass(card1, card2) {
        if (card1 && card2 && card1.winner && card2.winner && !card1.isPredicted && !card2.isPredicted) {
            return "confirmed";
        }
        return "predicted";
    }

    // 3. Render tree columns
    // Left Side Side
    const leftSideHTML = `
    <div class="bracket-side left-side">
        <!-- R32 Column (Left) -->
        <div class="bracket-column round-r32">
            ${[b.r32.M73, b.r32.M74, b.r32.M75, b.r32.M76, b.r32.M77, b.r32.M78, b.r32.M79, b.r32.M80].map(m => bktCardHTML(m)).join("")}
        </div>
        
        <!-- Connector 1 -->
        <div class="bkt-connector-col">
            <div class="bkt-conn-block bkt-conn-block-r32 ${getConnClass(b.r32.M73, b.r32.M74)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
            <div class="bkt-conn-block bkt-conn-block-r32 ${getConnClass(b.r32.M75, b.r32.M76)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
            <div class="bkt-conn-block bkt-conn-block-r32 ${getConnClass(b.r32.M77, b.r32.M78)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
            <div class="bkt-conn-block bkt-conn-block-r32 ${getConnClass(b.r32.M79, b.r32.M80)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
        </div>

        <!-- R16 Column (Left) -->
        <div class="bracket-column round-r16">
            ${[b.r16.M89, b.r16.M90, b.r16.M91, b.r16.M92].map(m => bktCardHTML(m)).join("")}
        </div>

        <!-- Connector 2 -->
        <div class="bkt-connector-col">
            <div class="bkt-conn-block bkt-conn-block-r16 ${getConnClass(b.r16.M89, b.r16.M90)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
            <div class="bkt-conn-block bkt-conn-block-r16 ${getConnClass(b.r16.M91, b.r16.M92)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
        </div>

        <!-- QF Column (Left) -->
        <div class="bracket-column round-qf">
            ${[b.qf.M97, b.qf.M98].map(m => bktCardHTML(m)).join("")}
        </div>

        <!-- Connector 3 -->
        <div class="bkt-connector-col">
            <div class="bkt-conn-block bkt-conn-block-qf ${getConnClass(b.qf.M97, b.qf.M98)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
        </div>

        <!-- SF Column (Left) -->
        <div class="bracket-column round-sf">
            ${bktCardHTML(b.sf.M101)}
        </div>
    </div>`;

    // Right Side Side
    const rightSideHTML = `
    <div class="bracket-side right-side">
        <!-- R32 Column (Right) -->
        <div class="bracket-column round-r32">
            ${[b.r32.M81, b.r32.M82, b.r32.M83, b.r32.M84, b.r32.M85, b.r32.M86, b.r32.M87, b.r32.M88].map(m => bktCardHTML(m)).join("")}
        </div>

        <!-- Connector 1 -->
        <div class="bkt-connector-col">
            <div class="bkt-conn-block bkt-conn-block-r32 ${getConnClass(b.r32.M81, b.r32.M82)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
            <div class="bkt-conn-block bkt-conn-block-r32 ${getConnClass(b.r32.M83, b.r32.M84)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
            <div class="bkt-conn-block bkt-conn-block-r32 ${getConnClass(b.r32.M85, b.r32.M86)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
            <div class="bkt-conn-block bkt-conn-block-r32 ${getConnClass(b.r32.M87, b.r32.M88)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
        </div>

        <!-- R16 Column (Right) -->
        <div class="bracket-column round-r16">
            ${[b.r16.M93, b.r16.M94, b.r16.M95, b.r16.M96].map(m => bktCardHTML(m)).join("")}
        </div>

        <!-- Connector 2 -->
        <div class="bkt-connector-col">
            <div class="bkt-conn-block bkt-conn-block-r16 ${getConnClass(b.r16.M93, b.r16.M94)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
            <div class="bkt-conn-block bkt-conn-block-r16 ${getConnClass(b.r16.M95, b.r16.M96)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
        </div>

        <!-- QF Column (Right) -->
        <div class="bracket-column round-qf">
            ${[b.qf.M99, b.qf.M100].map(m => bktCardHTML(m)).join("")}
        </div>

        <!-- Connector 3 -->
        <div class="bkt-connector-col">
            <div class="bkt-conn-block bkt-conn-block-qf ${getConnClass(b.qf.M99, b.qf.M100)}">
                <div class="bkt-conn-branch-top"></div><div class="bkt-conn-branch-bottom"></div>
            </div>
        </div>

        <!-- SF Column (Right) -->
        <div class="bracket-column round-sf">
            ${bktCardHTML(b.sf.M102)}
        </div>
    </div>`;

    // Center Column (Finals & Champion)
    const finalMatchHTML = bktCardHTML(b.m104);
    const thirdMatchHTML = bktCardHTML(b.m103);
    
    // Check if there is a champion
    let champFlag = "🏆";
    let champName = "TBD";
    let champSubtitle = "Projecting Final Winner...";
    
    if (b.m104 && b.m104.winner) {
        champFlag = F(b.m104.winner);
        champName = b.m104.winner;
        champSubtitle = b.m104.isPredicted ? "Predicted World Champion ⚡" : "FIFA World Champion! 🏆";
    }

    const centerColHTML = `
    <div class="bracket-center-col">
        <!-- Champion Box -->
        <div class="bkt-champ-box">
            <div class="bkt-champ-title">CHAMPION</div>
            <span class="bkt-champ-flag">${champFlag}</span>
            <div class="bkt-champ-name">${champName}</div>
            <div class="bkt-champ-subtitle">${champSubtitle}</div>
        </div>
        
        <!-- Final Match -->
        <div style="font-size:9px; font-weight:700; color:var(--gold); letter-spacing:1px; margin-bottom: 4px; text-transform:uppercase; font-family:'Fira Code',monospace;">
            <i data-lucide="trophy" class="icon-inline"></i>Final Match
        </div>
        <div class="bkt-final-match">
            ${finalMatchHTML}
        </div>

        <!-- 3rd Place Match -->
        <div style="font-size:9px; font-weight:700; color:var(--blue); letter-spacing:1px; margin-bottom: 4px; text-transform:uppercase; font-family:'Fira Code',monospace; margin-top:14px;">
            Third Place Play-off
        </div>
        <div class="bkt-third-match">
            ${thirdMatchHTML}
        </div>
    </div>`;

    // Put everything together
    document.getElementById("bracket-tree-view").innerHTML = `
        ${leftSideHTML}
        ${centerColHTML}
        ${rightSideHTML}
    `;

    // 4. Render Third Place Standings Table
    const qCount = Object.keys(getBracketQualifiers()).length;
    renderThirdPlaceStandings(qCount);

    // 5. Render Knockout progression stats callout
    const confirmedSlots = Object.keys(getBracketQualifiers()).length * 2; // R32 slots confirmed from groups
    const playedKO = Object.values(ST.results).filter(r => r.group === "R32" && r.hg != null).length;
    
    document.getElementById("bkt-later-stats").innerHTML = `
        <strong>Tournament Knockout Progression:</strong><br>
        · Confirmed group stage slots: <strong>${Math.floor(confirmedSlots / 2)}</strong> of 24 slots<br>
        · Knockout matches completed: <strong>${playedKO}</strong> matches<br>
        · Current Projection Mode: <strong>${SHOW_PROJECTED_BRACKET ? "Adaptive AI Model (ELO + Form)" : "Confirmed Actuals Only"}</strong>
    `;
}

function renderThirdPlaceStandings(qualified) {
    const thirds = [];
    let rowsSource = g => calcStandings(g);
    
    if (SHOW_PROJECTED_BRACKET) {
        const projResults = getProjectedResults();
        rowsSource = g => calcProjectedStandings(g, projResults);
    }
    
    Object.keys(GROUPS_META).forEach(g => {
        const rows = rowsSource(g);
        thirds.push({
            group: g,
            team: rows[2].t,
            p: rows[2].p,
            w: rows[2].w,
            d: rows[2].d,
            l: rows[2].l,
            gf: rows[2].gf,
            ga: rows[2].ga,
            gd: rows[2].gf - rows[2].ga,
            pts: rows[2].pts
        });
    });

    thirds.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return b.w - a.w;
    });

    const rowsHTML = thirds.map((r, i) => {
        const isQual = i < 8 && qualified > 0;
        const gdStr = r.gd > 0 ? "+" + r.gd : r.gd;
        return `<tr class="${isQual ? "qual" : ""}">
            <td class="ctr" style="color:var(--muted);font-size:10px">${i + 1}</td>
            <td>${F(r.team)} <strong style="font-weight:${isQual ? 700 : 400}">${r.team}</strong> <span style="font-size:9px;color:var(--muted)">(Grp ${r.group})</span></td>
            <td class="ctr">${r.p}</td>
            <td class="ctr">${r.w}</td>
            <td class="ctr" style="color:var(--muted)">${r.d}</td>
            <td class="ctr" style="color:var(--muted)">${r.l}</td>
            <td class="ctr" style="color:var(--muted)">${r.gf}:${r.ga}</td>
            <td class="${r.gd > 0 ? "gd-pos" : r.gd < 0 ? "gd-neg" : "gd-zero"}">${r.p > 0 ? gdStr : "–"}</td>
            <td class="pts-cell">${r.pts}</td>
            <td class="ctr">${isQual ? `<span class="q-q">Q</span>` : `<span class="q-x">–</span>`}</td>
        </tr>`;
    }).join("");

    document.getElementById("bkt-thirds").innerHTML = `
        <table>
            <thead>
                <tr>
                    <th class="ctr">#</th>
                    <th>Team</th>
                    <th class="ctr">P</th>
                    <th class="ctr">W</th>
                    <th class="ctr">D</th>
                    <th class="ctr">L</th>
                    <th class="ctr">G</th>
                    <th class="ctr">GD</th>
                    <th class="ctr">Pts</th>
                    <th class="ctr">Q</th>
                </tr>
            </thead>
            <tbody>${rowsHTML}</tbody>
        </table>`;
}

function toggleBracketProjection() {
    SHOW_PROJECTED_BRACKET = !SHOW_PROJECTED_BRACKET;
    saveLS("wc26_bkt_proj", SHOW_PROJECTED_BRACKET);
    renderBracket();
    if (window.lucide) lucide.createIcons();
}

function renderPredict() {
    const preditable = ST.upcoming.filter(m =>
        m.group !== "R32" && !m.home.includes("1st") && !m.home.includes("2nd") &&
        !m.home.includes("3rd") && !m.home.includes("Winner") && !m.home.includes("Group") &&
        !isMatchPlayedOrLive(m.home, m.away)
    );
    document.getElementById("pred-list").innerHTML = preditable.length > 0
        ? preditable.map(m => predCardHTML(m)).join("")
        : `<div style="color:var(--muted);font-size:13px;padding:16px;background:var(--bg2);border:1px solid var(--border);border-radius:8px">No upcoming group stage matches to predict right now.</div>`;
}

function renderAccuracy() {
    const total = HIST.length, correct = HIST.filter(h => h.correct).length;
    let streak = 0; for (const h of HIST) { if (h.correct) streak++; else break; }
    document.getElementById("acc-metrics").innerHTML = [
        { l: "Graded", v: total, c: "var(--text)" },
        { l: "Correct", v: correct, c: "var(--green)" },
        { l: "Accuracy", v: total > 0 ? ((correct / total) * 100).toFixed(0) + "%" : "–", c: "var(--gold)" },
        { l: "Streak", v: streak, c: "var(--blue)" },
        { l: "Model v", v: MODEL_V, c: "var(--purple)" },
        { l: "Bias Rules", v: Object.keys(BIAS).length, c: "var(--orange)" },
    ].map(m => `<div class="metric"><div class="metric-val" style="color:${m.c}">${m.v}</div><div class="metric-label">${m.l}</div></div>`).join("");

    document.getElementById("hist-label").textContent = `Prediction History (${total} graded)`;
    document.getElementById("pred-history").innerHTML = HIST.length > 0
        ? HIST.slice(0, 30).map(h => `
      <div class="hist-row">
        <span class="${h.correct ? "tag-correct" : "tag-wrong"}">${h.correct ? '<i data-lucide="check" class="icon-inline"></i>' : '<i data-lucide="x" class="icon-inline"></i>'}</span>
        <span style="font-size:12px;font-weight:600;flex:1">${F(h.home)} ${h.home} vs ${h.away} ${F(h.away)}</span>
        <span style="font-size:11px;color:var(--muted)">Pred: <strong style="color:${h.pred === "home" ? "var(--green)" : h.pred === "away" ? "var(--red)" : "var(--gold)"}">${h.pred === "home" ? h.home : h.pred === "away" ? h.away : "Draw"}</strong></span>
        <span style="font-size:11px;color:var(--dim)">→ <strong>${h.actual === "home" ? h.home : h.actual === "away" ? h.away : "Draw"}</strong></span>
        <span style="font-size:10px;color:var(--muted)">${h.date}</span>
        ${!h.correct ? `<span style="font-size:10px;color:var(--orange)">ELO: ${h.home} ${h.dH >= 0 ? "+" : ""}${h.dH} · ${h.away} ${h.dA >= 0 ? "+" : ""}${h.dA}</span>` : ""}
      </div>`).join("")
        : `<div style="color:var(--muted);font-size:13px;padding:12px 0">No graded predictions yet. Go to <strong style="color:var(--gold)">✅ Grade</strong> after matches finish.</div>`;

    const biasSection = document.getElementById("bias-section");
    const biasList = document.getElementById("bias-list");
    const biasEntries = Object.entries(BIAS);
    biasSection.style.display = biasEntries.length > 0 ? "block" : "none";
    biasList.innerHTML = biasEntries.map(([k, v]) => `
    <div class="hist-row" style="padding:7px 12px">
      <span style="font-size:12px;font-weight:600;flex:1">${k.replace("vs", " vs ")}</span>
      <span style="font-size:12px;font-weight:700;color:${v > 0 ? "var(--green)" : "var(--red)"}">${v > 0 ? "→ Home boosted" : "→ Away boosted"}: ${(Math.abs(v) * 100).toFixed(0)}pts</span>
    </div>`).join("");
}

function renderElo() {
    document.getElementById("elo-list").innerHTML = Object.entries(ELO)
        .sort((a, b) => b[1] - a[1])
        .map(([team, elo], i) => {
            const base = BASE_ELO[team] || 1300, d = elo - base;
            const pct = Math.max(5, Math.min(97, ((elo - 1100) / 900) * 100));
            return `<div class="elo-row">
        <span style="font-size:10px;color:var(--muted);font-family:'JetBrains Mono',monospace;min-width:22px">${i + 1}</span>
        <span style="font-size:17px;min-width:26px">${F(team)}</span>
        <span style="font-size:13px;font-weight:${i < 8 ? 700 : 400};flex:1;color:${i < 8 ? "var(--text)" : "var(--dim)"}">${team}</span>
        <div class="elo-bar-wrap"><div class="elo-bar-fill" style="width:${pct}%;background:${i < 8 ? "linear-gradient(90deg,var(--gold2),var(--gold))" : "var(--border2)"}"></div></div>
        <span style="font-size:13px;font-weight:700;color:var(--gold);font-family:'JetBrains Mono',monospace;min-width:40px;text-align:right">${elo}</span>
        <span style="font-size:11px;min-width:40px;text-align:right;color:${d > 0 ? "var(--green)" : d < 0 ? "var(--red)" : "var(--muted)"};font-family:'JetBrains Mono',monospace">${d === 0 ? "±0" : d > 0 ? "+" + d : d}</span>
      </div>`;
        }).join("");
}

function renderScorers() {
    const dynamicScorers = computeDynamicTopScorers();
    const maxG = dynamicScorers[0]?.goals || 1;
    document.getElementById("scorers-list").innerHTML =
        `<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;overflow:hidden">
      <div style="background:linear-gradient(90deg,#010a1e,#081828);padding:9px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between">
        <span style="font-size:10px;font-weight:700;letter-spacing:1.5px;color:var(--gold2);text-transform:uppercase">Golden Boot Standings</span>
        <span style="font-size:10px;color:var(--muted)">Live Standings · ${dynamicScorers.length} scorers</span>
      </div>
      ${dynamicScorers.map((s, i) => `
        <div class="scorer-row">
          <div class="scorer-rank">${i + 1}</div>
          <div style="font-size:22px;min-width:28px">${s.flag}</div>
          <div style="flex:1">
            <div class="scorer-name">${s.name}</div>
            <div class="scorer-team">${s.team}</div>
          </div>
          <div class="scorer-bar-wrap"><div class="scorer-bar" style="width:${Math.round((s.goals / maxG) * 100)}%"></div></div>
          <div class="scorer-goals">${s.goals}</div>
          <div style="font-size:10px;color:var(--muted);min-width:16px;text-align:center">⚽</div>
        </div>`).join("")}
    </div>`;

    const played = ST.results.length;
    const goals = ST.results.reduce((s, r) => s + (+r.hg || 0) + (+r.ag || 0), 0);
    const biggestWin = ST.results.reduce((best, r) => {
        const diff = Math.abs(r.hg - r.ag);
        return diff > (Math.abs(best.hg - best.ag) || 0) ? r : best;
    }, { hg: 0, ag: 0, home: "–", away: "–", group: "?" });
    const highestScoring = ST.results.reduce((best, r) => {
        return (r.hg + r.ag) > ((best.hg || 0) + (best.ag || 0)) ? r : best;
    }, { hg: 0, ag: 0, home: "–", away: "–" });
    const draws = ST.results.filter(r => r.hg === r.ag).length;
    const cleanSheets = ST.results.filter(r => r.hg === 0 || r.ag === 0).length;
    const groupGoals = {};
    ST.results.forEach(r => {
        if (!groupGoals[r.group]) groupGoals[r.group] = 0;
        groupGoals[r.group] += (+r.hg || 0) + (+r.ag || 0);
    });
    const topGroup = Object.entries(groupGoals).sort((a, b) => b[1] - a[1])[0] || ["–", 0];

    document.getElementById("tournament-stats").innerHTML = `
    <div class="stat-cards">
      <div class="stat-card"><div class="stat-card-val">${goals}</div><div class="stat-card-label">Total Goals</div><div class="stat-card-sub">${played} matches</div></div>
      <div class="stat-card"><div class="stat-card-val">${(goals / Math.max(played, 1)).toFixed(1)}</div><div class="stat-card-label">Goals / Game</div><div class="stat-card-sub">Tournament avg</div></div>
      <div class="stat-card"><div class="stat-card-val">${draws}</div><div class="stat-card-label">Draws</div><div class="stat-card-sub">${Math.round(draws / Math.max(played, 1) * 100)}% of matches</div></div>
      <div class="stat-card"><div class="stat-card-val">${cleanSheets}</div><div class="stat-card-label">Clean Sheets</div><div class="stat-card-sub">Shutouts so far</div></div>
      <div class="stat-card"><div class="stat-card-val">Grp ${topGroup[0]}</div><div class="stat-card-label">Highest Scoring Group</div><div class="stat-card-sub">${topGroup[1]} goals</div></div>
      <div class="stat-card"><div class="stat-card-val">${biggestWin.hg}–${biggestWin.ag}</div><div class="stat-card-label">Biggest Win</div><div class="stat-card-sub">${biggestWin.home} v ${biggestWin.away}</div></div>
      <div class="stat-card"><div class="stat-card-val">${highestScoring.hg + highestScoring.ag}</div><div class="stat-card-label">Most Goals in a Match</div><div class="stat-card-sub">${highestScoring.home} ${highestScoring.hg}–${highestScoring.ag} ${highestScoring.away}</div></div>
    </div>`;
}

function renderGrade() {
    const graded = new Set(HIST.map(h => `${h.home}vs${h.away}`));
    const toGrade = ST.upcoming.filter(m => !graded.has(`${m.home}vs${m.away}`) && m.group !== "R32" && !m.home.includes("1st") && !m.home.includes("2nd") && !m.home.includes("Group") && !isMatchPlayedOrLive(m.home, m.away));
    document.getElementById("grade-list").innerHTML = toGrade.map(m => {
        const key = `${m.home}vs${m.away}`;
        const p = predictMatch(m.home, m.away, ST.results, ELO, BIAS);
        const mc = p.hw > p.aw && p.hw > p.dr ? "home" : p.aw > p.dr ? "away" : "draw";
        const mcLabel = mc === "home" ? m.home : mc === "away" ? m.away : "Draw";
        const mcCol = mc === "home" ? "var(--green)" : mc === "away" ? "var(--red)" : "var(--gold)";
        return `<div class="grade-card" id="gc-${key}">
      <div class="grade-teams">
        <span class="badge badge-group">Grp ${m.group}</span>
        <span style="font-size:18px">${F(m.home)}</span>
        <span style="font-size:13px;font-weight:700;flex:1;color:#c8d8f0">${m.home}</span>
        <span style="font-size:11px;color:var(--muted)">vs</span>
        <span style="font-size:13px;font-weight:700;flex:1;text-align:right;color:#c8d8f0">${m.away}</span>
        <span style="font-size:18px">${F(m.away)}</span>
        <span style="font-size:10px;color:var(--muted)">${m.date}</span>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:11px">
        Model predicted: <strong style="color:${mcCol}">${mcLabel}</strong>
        (${Math.round(p.hw * 100)}% / ${Math.round(p.dr * 100)}% / ${Math.round(p.aw * 100)}%)
        · Score: ${p.score[0]}–${p.score[1]}
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <span style="font-size:13px;font-weight:600;color:#aabbcc;min-width:100px;text-align:right">${m.home}</span>
        <input class="score-input" type="number" min="0" max="20" placeholder="0" id="hs-${key}" oninput="this.style.borderColor='var(--gold)'"/>
        <span style="color:var(--muted);font-size:16px;font-weight:700">–</span>
        <input class="score-input" type="number" min="0" max="20" placeholder="0" id="as-${key}" oninput="this.style.borderColor='var(--gold)'"/>
        <span style="font-size:13px;font-weight:600;color:#aabbcc;min-width:100px">${m.away}</span>
        <button class="btn-gold" data-key="${key}" onclick="handleGrade(this)" style="margin-left:auto;display:inline-flex;align-items:center"><i data-lucide="brain" class="icon-inline"></i>Submit & Learn</button>
      </div>
      <div id="gf-${key}"></div>
    </div>`;
    }).join("") || `<div style="color:var(--muted);font-size:13px;padding:16px;background:var(--bg2);border:1px solid var(--border);border-radius:8px">All tracked matches graded. More appear as the tournament progresses.</div>`;
}

// ─────────────────────────────────────────────────────────────
// PREDICTOR ACTIONS
// ─────────────────────────────────────────────────────────────
function handlePick(btn) {
    const key = btn.dataset.key;
    const pick = btn.dataset.pick;
    const match = ST.upcoming.find(m => `${m.home}vs${m.away}` === key) ||
        [...ST.results, ...ST.live].find(m => `${m.home}vs${m.away}` === key);
    if (!match) return;
    setPick(key, pick, match.home, match.away, match.group, match.date);
}
function handleGrade(btn) {
    const key = btn.dataset.key;
    const match = ST.upcoming.find(m => `${m.home}vs${m.away}` === key);
    if (!match) return;
    submitGrade(key, match.home, match.away, match.group, match.date);
}
function setPick(key, pick, home, away, group, date) {
    PICKS[key] = pick;
    saveLS("wc26_picks", PICKS);
    const el = document.getElementById("pc-" + key);
    if (el) {
        const m = { home, away, group, date, time: el.querySelector(".pred-date")?.textContent?.split("·")[1]?.trim() || "", venue: el.querySelector(".pred-venue")?.textContent?.split("·")[1]?.trim() || "" };
        el.outerHTML = predCardHTML(m);
    } else { renderPredict(); }
}

function submitGrade(key, home, away, group, date) {
    const hs = parseInt(document.getElementById("hs-" + key)?.value ?? "");
    const as_ = parseInt(document.getElementById("as-" + key)?.value ?? "");
    const fb = document.getElementById("gf-" + key);
    if (isNaN(hs) || isNaN(as_)) { if (fb) { fb.className = "grade-feedback wrong"; fb.textContent = "Enter both scores first."; } return; }

    const ur = { group, home, away, hg: hs, ag: as_, date, status: "FT" };
    
    const idx = USER_RESULTS.findIndex(r => r.home === home && r.away === away);
    if (idx !== -1) {
        USER_RESULTS[idx] = ur;
    } else {
        USER_RESULTS.push(ur);
    }
    saveLS("wc26_user_results", USER_RESULTS);
    if (window.StandingsService) {
        window.StandingsService.invalidateCache();
    }

    ST.results = mergeResults(mergeResults(FALLBACK_RESULTS, API_RESULTS_CACHE), USER_RESULTS);
    runSimulation();

    const histEntry = HIST.find(h => h.home === home && h.away === away);
    const correct = histEntry ? histEntry.correct : false;
    const pred = histEntry ? histEntry.pred : "draw";
    const actual = hs > as_ ? "home" : hs < as_ ? "away" : "draw";
    const nh = ELO[home], na = ELO[away];

    MODEL_V++; saveLS("wc26_mv", MODEL_V);

    if (fb) {
        fb.className = `grade-feedback ${correct ? "correct" : "wrong"}`;
        fb.innerHTML = correct
            ? `<i data-lucide="check" class="icon-inline"></i>Correct! Model reinforced. ELO: ${home} → ${nh} · ${away} → ${na}`
            : `<i data-lucide="alert-circle" class="icon-inline"></i>Wrong (predicted ${pred === "home" ? home : pred === "away" ? away : "Draw"}, was ${actual === "home" ? home : actual === "away" ? away : "Draw"}). Bias corrected. ELO: ${home} → ${nh} · ${away} → ${na}`;
    }

    updateHeader();
    renderAccuracy();
    renderElo();
    renderOverview();
    renderGroups();
    renderResults();
    renderUpcoming();
    renderBracket();
    setTimeout(() => {
        const gc = document.getElementById("gc-" + key);
        if (gc) { gc.style.opacity = "0.5"; gc.style.pointerEvents = "none"; }
        renderAll();
    }, 2000);
}

// ─────────────────────────────────────────────────────────────
// AI ANALYST
// ─────────────────────────────────────────────────────────────
function getLocalAIAnalysis() {
    const preditable = ST.upcoming.filter(m =>
        m.group !== "R32" && !m.home.includes("1st") && !m.home.includes("2nd") &&
        !m.home.includes("3rd") && !m.home.includes("Winner") && !m.home.includes("Group") &&
        !isMatchPlayedOrLive(m.home, m.away)
    );

    if (!preditable.length) {
        return "No upcoming group stage matches to analyze.";
    }

    let highUncertMatch = null;
    let minEloDiff = Infinity;
    preditable.forEach(m => {
        const p = predictMatch(m.home, m.away, ST.results, ELO, BIAS);
        const eloDiff = Math.abs(p.eloH - p.eloA);
        if (eloDiff < minEloDiff) {
            minEloDiff = eloDiff;
            highUncertMatch = m;
        }
    });

    let insight1 = "";
    if (highUncertMatch) {
        const p = predictMatch(highUncertMatch.home, highUncertMatch.away, ST.results, ELO, BIAS);
        insight1 = `🔍 **Highest Uncertainty Match:** **${highUncertMatch.home} vs ${highUncertMatch.away}** (Group ${highUncertMatch.group})
   · The ELO gap is only ${Math.abs(p.eloH - p.eloA)} points (${highUncertMatch.home}: ${p.eloH} vs ${highUncertMatch.away}: ${p.eloA}).
   · The model estimates a **${Math.round(p.dr * 100)}%** probability of a draw, with the win probabilities closely split (${Math.round(p.hw * 100)}% Win vs ${Math.round(p.aw * 100)}% Loss). ELO and form suggest a deadlock; tactical setup will be the differentiator.`;
    }

    let insight2 = "";
    const wrongP = HIST.filter(h => !h.correct);
    if (wrongP.length === 0) {
        insight2 = `📈 **Systematic Blind Spot:** **None detected yet.**
   · The model is currently running at 100% accuracy on graded matches. As more match results are submitted, it will analyze incorrect predictions to identify if it is overvaluing historical ELO or undervaluing recent team form.`;
    } else {
        let undervaluedDraw = 0;
        wrongP.forEach(h => {
            if (h.actual === "draw") undervaluedDraw++;
        });

        const totalWrong = wrongP.length;
        if (undervaluedDraw > totalWrong / 2) {
            insight2 = `📈 **Systematic Blind Spot:** **Underrating draws.**
   · Out of ${totalWrong} wrong predictions, ${undervaluedDraw} were due to unexpected draws. The model's ELO and form components tend to push for decisive outcomes, slightly undervaluing defensive setups that play for a point.`;
        } else {
            insight2 = `📈 **Systematic Blind Spot:** **Overvaluing historical ELO.**
   · The model has missed some recent upsets. It currently weights ELO at 60% and form at 25%. If upsets continue, consider adjusting matchup biases or giving more weight to recent form trends.`;
        }
    }

    let highConfMatch = null;
    let maxWinProb = 0;
    let favoredTeam = "";
    let favoredProb = 0;
    preditable.forEach(m => {
        const p = predictMatch(m.home, m.away, ST.results, ELO, BIAS);
        if (p.hw > maxWinProb) {
            maxWinProb = p.hw;
            highConfMatch = m;
            favoredTeam = m.home;
            favoredProb = p.hw;
        }
        if (p.aw > maxWinProb) {
            maxWinProb = p.aw;
            highConfMatch = m;
            favoredTeam = m.away;
            favoredProb = p.aw;
        }
    });

    let insight3 = "";
    if (highConfMatch) {
        const p = predictMatch(highConfMatch.home, highConfMatch.away, ST.results, ELO, BIAS);
        insight3 = `🎯 **Highest-Confidence Pick:** **${favoredTeam}** to win against ${favoredTeam === highConfMatch.home ? highConfMatch.away : highConfMatch.home} (Group ${highConfMatch.group})
   · The model predicts a **${Math.round(favoredProb * 100)}%** chance of success.
   · This is driven by a significant ELO advantage of **${Math.abs(p.eloH - p.eloA)}** points (${highConfMatch.home}: ${p.eloH} vs ${highConfMatch.away}: ${p.eloA}) combined with superior team form.`;
    }

    return `⚡ **Adaptive Model Insights & Analysis (v${MODEL_V})**
    
${insight1}

${insight2}

${insight3}`;
}

function runAI() {
    const btn = document.getElementById("ai-run-btn");
    const out = document.getElementById("ai-result");
    if (btn) { btn.disabled = true; btn.innerHTML = 'Analyzing<span class="spinner"></span>'; }
    out.textContent = "";
    
    setTimeout(() => {
        out.className = "ai-result";
        out.innerHTML = getLocalAIAnalysis().replace(/\n/g, "<br>");
        if (btn) { btn.disabled = false; btn.textContent = "Run Analysis"; }
    }, 600);
}

function resetModel() {
    if (confirm("Are you sure you want to reset all manual picks, custom grades, and model learning? This will restore the ELO to baseline and clear history.")) {
        localStorage.removeItem("wc26_user_results");
        localStorage.removeItem("wc26_picks");
        localStorage.removeItem("wc26_graded");
        localStorage.removeItem("wc26_mv");
        localStorage.removeItem("wc26_bias");
        localStorage.removeItem("wc26_hist");
        localStorage.removeItem("wc26_elo_overrides");
        if (window.StandingsService) {
            window.StandingsService.invalidateCache();
        }
        USER_RESULTS = [];
        PICKS = {};
        GRADED = {};
        MODEL_V = 1;
        BIAS = {};
        HIST = [];
        ST.results = mergeResults(mergeResults(FALLBACK_RESULTS, API_RESULTS_CACHE), USER_RESULTS);
        runSimulation();
        renderAll();
    }
}

// ─────────────────────────────────────────────────────────────
// UI CONTROLS
// ─────────────────────────────────────────────────────────────
function showTab(id, btn) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.getElementById("page-" + id)?.classList.add("active");
    if (btn) btn.classList.add("active");
    if (id === "overview") renderOverview();
    if (id === "live") renderLive();
    if (id === "groups") renderGroups();
    if (id === "results") renderResults();
    if (id === "upcoming") renderUpcoming();
    if (id === "bracket") renderBracket();
    if (id === "predict") renderPredict();
    if (id === "accuracy") renderAccuracy();
    if (id === "elo") renderElo();
    if (id === "scorers") renderScorers();
    if (id === "teams") renderTeams();
    if (id === "grade") renderGrade();
    if (window.lucide) lucide.createIcons();
}
function setStatus(type, msg) {
    const d = document.getElementById("sdot");
    if (d) d.className = "sdot " + type;
    const txt = document.getElementById("stext");
    if (txt) txt.textContent = msg;
}
function startCountdown() {
    cdVal = 30; clearInterval(cdTimer);
    cdTimer = setInterval(() => {
        cdVal--;
        const el = document.getElementById("countdown");
        if (el) el.textContent = cdVal;
        if (cdVal <= 0) {
            if (window.StandingsService) {
                const hasLive = ST.live && ST.live.length > 0;
                window.StandingsService.fetchLatestStandings(hasLive);
            }
            fetchData();
            startCountdown();
        }
    }, 1000);
}
function manualRefresh() {
    if (window.StandingsService) {
        window.StandingsService.fetchLatestStandings(true);
    }
    fetchData();
    startCountdown();
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
let NOTIF_ENABLED = loadLS("wc26_notif", false);
let LAST_LIVE_SCORES = {};
let LAST_LIVE_COUNT = 0;

function toggleNotifications() {
    if (NOTIF_ENABLED) {
        NOTIF_ENABLED = false; saveLS("wc26_notif", false);
        updateNotifBtn();
        return;
    }
    if (!("Notification" in window)) {
        alert("Your browser doesn't support notifications."); return;
    }
    Notification.requestPermission().then(p => {
        if (p === "granted") {
            NOTIF_ENABLED = true; saveLS("wc26_notif", true);
            updateNotifBtn();
            new Notification("⚽ WC2026 Tracker", { body: "Goal & kickoff alerts enabled!", icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>" });
        }
    });
}
function updateNotifBtn() {
    const btn = document.getElementById("notif-btn");
    if (!btn) return;
    btn.innerHTML = NOTIF_ENABLED 
        ? `<i data-lucide="bell" class="icon-inline"></i>On` 
        : `<i data-lucide="bell-off" class="icon-inline"></i>Alerts`;
    btn.className = NOTIF_ENABLED ? "notif-btn enabled" : "notif-btn";
    if (window.lucide) lucide.createIcons();
}
function checkNotifications() {
    if (!NOTIF_ENABLED || Notification.permission !== "granted") return;
    const liveNow = ST.live.length;
    if (liveNow > LAST_LIVE_COUNT && LAST_LIVE_COUNT === 0 && liveNow > 0) {
        ST.live.forEach(m => {
            new Notification(`⚽ KICK OFF!`, {
                body: `${m.home} vs ${m.away} — Group ${m.group} is LIVE`,
                icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>"
            });
        });
    }
    ST.live.forEach(m => {
        const key = `${m.home}vs${m.away}`;
        const prev = LAST_LIVE_SCORES[key];
        const curr = `${m.hg}-${m.ag}`;
        if (prev && prev !== curr) {
            new Notification(`⚽ GOAL! ${m.home} ${m.hg}–${m.ag} ${m.away}`, {
                body: `Group ${m.group} · ${m.minute || ""}' · Score updated`,
                icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>"
            });
        }
        LAST_LIVE_SCORES[key] = curr;
    });
    LAST_LIVE_COUNT = liveNow;
}

// ── KEYBOARD SHORTCUTS ──────────────────────────────────────
const TAB_KEYS = {
    "1": "overview", "2": "live", "3": "groups", "4": "results",
    "5": "upcoming", "6": "bracket", "7": "predict", "8": "accuracy",
    "9": "elo", "0": "scorers", "g": "grade", "r": "refresh", "t": "teams"
};
document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT") return;
    const action = TAB_KEYS[e.key];
    if (!action) return;
    if (action === "refresh") { manualRefresh(); return; }
    const btn = Array.from(document.querySelectorAll(".tab"))
        .find(t => t.getAttribute("onclick")?.includes("'" + action + "'"));
    if (btn) showTab(action, btn);
});

// ── DARK/LIGHT MODE ─────────────────────────────────────────
let DARK_MODE = loadLS("wc26_dark", true);
function applyTheme() {
    if (!DARK_MODE) {
        /* Light Mode (Team Red + Gold) */
        document.documentElement.style.setProperty("--bg", "#FEF2F2");
        document.documentElement.style.setProperty("--bg2", "#FFFFFF");
        document.documentElement.style.setProperty("--bg3", "#FEE2E2");
        document.documentElement.style.setProperty("--border", "#FECACA");
        document.documentElement.style.setProperty("--border2", "#FCA5A5");
        document.documentElement.style.setProperty("--text", "#7F1D1D");
        document.documentElement.style.setProperty("--muted", "#DC2626");
        document.documentElement.style.setProperty("--dim", "#EF4444");
        document.documentElement.style.setProperty("--gold", "#D97706");
        document.documentElement.style.setProperty("--gold2", "#B45309");
    } else {
        document.documentElement.style.removeProperty("--bg");
        document.documentElement.style.removeProperty("--bg2");
        document.documentElement.style.removeProperty("--bg3");
        document.documentElement.style.removeProperty("--border");
        document.documentElement.style.removeProperty("--border2");
        document.documentElement.style.removeProperty("--text");
        document.documentElement.style.removeProperty("--muted");
        document.documentElement.style.removeProperty("--dim");
        document.documentElement.style.removeProperty("--gold");
        document.documentElement.style.removeProperty("--gold2");
    }
}
function toggleTheme() {
    DARK_MODE = !DARK_MODE;
    saveLS("wc26_dark", DARK_MODE);
    const btn = document.getElementById("theme-btn");
    if (btn) btn.innerHTML = DARK_MODE ? `<i data-lucide="sun" class="icon-inline"></i>Light` : `<i data-lucide="moon" class="icon-inline"></i>Dark`;
    applyTheme();
    if (window.lucide) lucide.createIcons();
}

// ── SHARE MY PICKS ───────────────────────────────────────────
function sharepicks() {
    const picks = Object.entries(PICKS);
    if (!picks.length) { alert("No picks saved yet. Go to 🎯 Predict and log your picks first."); return; }
    const lines = picks.map(([key, pick]) => {
        const [home, away] = key.split("vs");
        const result = pick === "home" ? home : pick === "away" ? away : "Draw";
        return `${F(home)} ${home} vs ${away} ${F(away)} → ${result}`;
    });
    const text = `My FIFA World Cup 2026 Picks 🏆

${lines.join("\n")}

https://twevythelwel-star.github.io/WorldCup26Tracker/`;
    if (navigator.share) {
        navigator.share({ title: "My WC2026 Picks", text });
    } else {
        navigator.clipboard.writeText(text).then(() => alert("Picks copied to clipboard!"));
    }
}

// ─────────────────────────────────────────────────────────────
// KNOCKOUT BRACKET RESOLVER & TEAM STATUS TRACKER
// ─────────────────────────────────────────────────────────────
function getProjectedResults() {
    const projected = [];
    ST.results.forEach(r => {
        if (r.hg != null) {
            projected.push({ ...r });
        }
    });

    ST.upcoming.forEach(m => {
        if (m.group === "R32" || m.group === "R16" || m.group === "QF" || m.group === "SF" || m.group === "Final") return;
        if (projected.some(p => p.home === m.home && p.away === m.away)) return;

        const p = predictMatch(m.home, m.away, projected, ELO, BIAS);
        projected.push({
            group: m.group,
            home: m.home,
            away: m.away,
            hg: p.score[0],
            ag: p.score[1],
            date: m.date,
            status: "Projected",
            venue: m.venue || ""
        });
    });

    return projected;
}

function calcProjectedStandings(g, projectedResults) {
    const teams = GROUPS_META[g] || [];
    const rows = {};
    teams.forEach(t => rows[t] = { t, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 });
    projectedResults.filter(r => r.group === g).forEach(r => {
        const h = rows[r.home], a = rows[r.away];
        if (!h || !a) return;
        h.p++; a.p++; h.gf += +r.hg; h.ga += +r.ag; a.gf += +r.ag; a.ga += +r.hg;
        if (+r.hg > +r.ag) { h.w++; h.pts += 3; a.l++; }
        else if (+r.hg < +r.ag) { a.w++; a.pts += 3; h.l++; }
        else { h.d++; h.pts++; a.d++; a.pts++; }
    });
    return Object.values(rows).sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        const gd = (a.gf - a.ga), gdb = (b.gf - b.ga);
        if (gdb !== gd) return gdb - gd;
        return b.gf - a.gf;
    });
}

function getProjectedBracketQualifiers(projectedResults) {
    const q = {};
    const thirds = [];
    Object.keys(GROUPS_META).forEach(g => {
        const rows = calcProjectedStandings(g, projectedResults);
        q[g + "_1"] = rows[0].t;
        q[g + "_2"] = rows[1].t;
        thirds.push({
            group: g,
            team: rows[2].t,
            pts: rows[2].pts,
            gd: rows[2].gf - rows[2].ga,
            gf: rows[2].gf,
            w: rows[2].w,
            p: rows[2].p
        });
    });

    thirds.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        if (b.gf !== a.gf) return b.gf - a.gf;
        return b.w - a.w;
    });

    const top8Thirds = thirds.slice(0, 8).map(t => t.team);
    return { q, top8Thirds };
}

function resolveKnockoutBracket(projected = true) {
    let q, topThirds;
    let resultsForKnockout = ST.results;

    if (projected) {
        const projResults = getProjectedResults();
        const qual = getProjectedBracketQualifiers(projResults);
        q = qual.q;
        topThirds = qual.top8Thirds;
        resultsForKnockout = projResults;
    } else {
        q = getBracketQualifiers();
        const thirds = [];
        Object.keys(GROUPS_META).forEach(g => {
            let rows;
            if (window.StandingsService && window.StandingsService.data && window.StandingsService.data[g] && (!USER_RESULTS || USER_RESULTS.length === 0)) {
                rows = window.StandingsService.data[g];
                if (rows[2]) {
                    thirds.push({ 
                        group: g, 
                        team: rows[2].team || rows[2].t, 
                        pts: rows[2].points ?? rows[2].pts, 
                        gd: rows[2].gd ?? (rows[2].gf - rows[2].ga), 
                        gf: rows[2].gf, 
                        w: rows[2].won ?? rows[2].w, 
                        p: rows[2].played ?? rows[2].p 
                    });
                }
            } else {
                rows = calcStandings(g);
                if (rows[2]) {
                    thirds.push({ group: g, team: rows[2].t, pts: rows[2].pts, gd: rows[2].gf - rows[2].ga, gf: rows[2].gf, w: rows[2].w, p: rows[2].p });
                }
            }
        });
        thirds.sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            if (b.gd !== a.gd) return b.gd - a.gd;
            if (b.gf !== a.gf) return b.gf - a.gf;
            return b.w - a.w;
        });
        topThirds = thirds.slice(0, 8).map(t => t.team);
    }

    function getMatchOutcome(t1, t2) {
        if (!t1 || !t2 || t1.includes("Group") || t2.includes("Group") || t1.includes("Winner") || t2.includes("Winner") || t1.includes("3rd") || t2.includes("3rd") || t1 === "TBD" || t2 === "TBD") {
            return { winner: null, isPredicted: false };
        }
        const match = ST.results.find(r => 
            ((r.home === t1 && r.away === t2) || (r.home === t2 && r.away === t1)) && r.hg != null
        );
        if (match) {
            const isHome = match.home === t1;
            let winner;
            if (match.hg > match.ag) winner = isHome ? t1 : t2;
            else if (match.ag > match.hg) winner = isHome ? t2 : t1;
            else winner = match.winner || (match.hg > match.ag ? match.home : match.away);
            return { 
                winner, 
                isPredicted: false,
                score1: isHome ? match.hg : match.ag,
                score2: isHome ? match.ag : match.hg
            };
        }

        if (projected) {
            const p = predictMatch(t1, t2, resultsForKnockout, ELO, BIAS);
            let winner;
            if (p.score[0] > p.score[1]) {
                winner = t1;
            } else if (p.score[1] > p.score[0]) {
                winner = t2;
            } else {
                // Tiebreaker: use ELO win probability
                winner = p.hw >= p.aw ? t1 : t2;
            }
            return { winner, isPredicted: true };
        }

        return { winner: null, isPredicted: false };
    }

    const r32Matches = {};
    const assignedThirds = new Set();

    function getThirdQualifierForSlot(allowedGroups) {
        for (let team of topThirds) {
            if (assignedThirds.has(team)) continue;
            const grp = Object.keys(GROUPS_META).find(g => GROUPS_META[g].includes(team));
            if (allowedGroups.includes(grp)) {
                assignedThirds.add(team);
                return team;
            }
        }
        for (let team of topThirds) {
            if (!assignedThirds.has(team)) {
                assignedThirds.add(team);
                return team;
            }
        }
        return null;
    }

    function resolveTeam(label) {
        if (!label) return null;
        const m1 = label.match(/Group ([A-L]) 1st/i);
        const m2 = label.match(/Group ([A-L]) 2nd/i);
        if (m1) return q[m1[1] + "_1"] || null;
        if (m2) return q[m2[1] + "_2"] || null;

        const m3 = label.match(/3rd \(([A-L\/]+)\)/i);
        if (m3) {
            const allowed = m3[1].split("/");
            return getThirdQualifierForSlot(allowed);
        }
        return label;
    }

    R32.forEach(m => {
        const t1 = resolveTeam(m.t1);
        const t2 = resolveTeam(m.t2);
        const outcome = getMatchOutcome(t1, t2);
        r32Matches[m.id] = { 
            id: m.id, d: m.d, v: m.v, 
            t1: t1 || m.t1, t2: t2 || m.t2, 
            winner: outcome.winner, isPredicted: outcome.isPredicted,
            score1: outcome.score1, score2: outcome.score2
        };
    });

    const r16Matches = {};
    const r16Definitions = [
        { id: "M89", d: "Jul 4", v: "Philadelphia", prev1: "M73", prev2: "M74" },
        { id: "M90", d: "Jul 4", v: "Houston", prev1: "M75", prev2: "M76" },
        { id: "M91", d: "Jul 5", v: "New York/NJ", prev1: "M77", prev2: "M78" },
        { id: "M92", d: "Jul 5", v: "Mexico City", prev1: "M79", prev2: "M80" },
        { id: "M93", d: "Jul 6", v: "Seattle", prev1: "M81", prev2: "M82" },
        { id: "M94", d: "Jul 6", v: "Vancouver", prev1: "M83", prev2: "M84" },
        { id: "M95", d: "Jul 7", v: "Boston", prev1: "M85", prev2: "M86" },
        { id: "M96", d: "Jul 7", v: "Miami", prev1: "M87", prev2: "M88" }
    ];

    r16Definitions.forEach(m => {
        const t1 = r32Matches[m.prev1]?.winner;
        const t2 = r32Matches[m.prev2]?.winner;
        const outcome = getMatchOutcome(t1, t2);
        r16Matches[m.id] = { 
            id: m.id, d: m.d, v: m.v, 
            t1: t1 || `Winner ${m.prev1}`, t2: t2 || `Winner ${m.prev2}`, 
            winner: outcome.winner, isPredicted: outcome.isPredicted,
            score1: outcome.score1, score2: outcome.score2
        };
    });

    const qfMatches = {};
    const qfDefinitions = [
        { id: "M97", d: "Jul 9", v: "Boston", prev1: "M89", prev2: "M90" },
        { id: "M98", d: "Jul 9", v: "Los Angeles", prev1: "M91", prev2: "M92" },
        { id: "M99", d: "Jul 10", v: "Miami", prev1: "M93", prev2: "M94" },
        { id: "M100", d: "Jul 11", v: "Kansas City", prev1: "M95", prev2: "M96" }
    ];

    qfDefinitions.forEach(m => {
        const t1 = r16Matches[m.prev1]?.winner;
        const t2 = r16Matches[m.prev2]?.winner;
        const outcome = getMatchOutcome(t1, t2);
        qfMatches[m.id] = { 
            id: m.id, d: m.d, v: m.v, 
            t1: t1 || `Winner ${m.prev1}`, t2: t2 || `Winner ${m.prev2}`, 
            winner: outcome.winner, isPredicted: outcome.isPredicted,
            score1: outcome.score1, score2: outcome.score2
        };
    });

    const sfMatches = {};
    const sfDefinitions = [
        { id: "M101", d: "Jul 14", v: "Dallas", prev1: "M97", prev2: "M98" },
        { id: "M102", d: "Jul 15", v: "Atlanta", prev1: "M99", prev2: "M100" }
    ];

    sfDefinitions.forEach(m => {
        const t1 = qfMatches[m.prev1]?.winner;
        const t2 = qfMatches[m.prev2]?.winner;
        const outcome = getMatchOutcome(t1, t2);
        sfMatches[m.id] = { 
            id: m.id, d: m.d, v: m.v, 
            t1: t1 || `Winner ${m.prev1}`, t2: t2 || `Winner ${m.prev2}`, 
            winner: outcome.winner, isPredicted: outcome.isPredicted,
            score1: outcome.score1, score2: outcome.score2
        };
    });

    const t1_103 = sfMatches["M101"]?.t1 && sfMatches["M101"]?.t2 ? (sfMatches["M101"].winner === sfMatches["M101"].t1 ? sfMatches["M101"].t2 : sfMatches["M101"].t1) : null;
    const t2_103 = sfMatches["M102"]?.t1 && sfMatches["M102"]?.t2 ? (sfMatches["M102"].winner === sfMatches["M102"].t1 ? sfMatches["M102"].t2 : sfMatches["M102"].t1) : null;
    const outcome103 = getMatchOutcome(t1_103, t2_103);
    const m103 = { 
        id: "M103", d: "Jul 18", v: "Miami", 
        t1: t1_103 || "Loser M101", t2: t2_103 || "Loser M102", 
        winner: outcome103.winner, isPredicted: outcome103.isPredicted,
        score1: outcome103.score1, score2: outcome103.score2
    };

    const t1_104 = sfMatches["M101"]?.winner;
    const t2_104 = sfMatches["M102"]?.winner;
    const outcome104 = getMatchOutcome(t1_104, t2_104);
    const m104 = { 
        id: "M104", d: "Jul 19", v: "New York/NJ", 
        t1: t1_104 || "Winner M101", t2: t2_104 || "Winner M102", 
        winner: outcome104.winner, isPredicted: outcome104.isPredicted,
        score1: outcome104.score1, score2: outcome104.score2
    };

    return {
        r32: r32Matches,
        r16: r16Matches,
        qf: qfMatches,
        sf: sfMatches,
        m103,
        m104
    };
}

function getTeamStatuses() {
    const teamStatuses = {};
    Object.keys(BASE_ELO).forEach(team => {
        const grp = Object.keys(GROUPS_META).find(g => GROUPS_META[g].includes(team));
        teamStatuses[team] = {
            team,
            group: grp,
            status: "Active",
            round: "Group Stage",
            rank: ELO[team] || BASE_ELO[team] || 1300
        };
    });

    const bkt = resolveKnockoutBracket(false);

    const r32Teams = new Set();
    Object.values(bkt.r32).forEach(m => {
        if (m.t1) r32Teams.add(m.t1);
        if (m.t2) r32Teams.add(m.t2);
    });

    const r16Teams = new Set();
    Object.values(bkt.r16).forEach(m => {
        if (m.t1) r16Teams.add(m.t1);
        if (m.t2) r16Teams.add(m.t2);
    });

    const qfTeams = new Set();
    Object.values(bkt.qf).forEach(m => {
        if (m.t1) qfTeams.add(m.t1);
        if (m.t2) qfTeams.add(m.t2);
    });

    const sfTeams = new Set();
    Object.values(bkt.sf).forEach(m => {
        if (m.t1) sfTeams.add(m.t1);
        if (m.t2) sfTeams.add(m.t2);
    });

    r32Teams.forEach(team => {
        if (teamStatuses[team]) {
            teamStatuses[team].round = "Round of 32";
            const match = Object.values(bkt.r32).find(m => m.t1 === team || m.t2 === team);
            if (match && match.winner) {
                if (match.winner !== team) {
                    teamStatuses[team].status = "Eliminated";
                }
            }
        }
    });

    r16Teams.forEach(team => {
        if (teamStatuses[team]) {
            teamStatuses[team].round = "Round of 16";
            const match = Object.values(bkt.r16).find(m => m.t1 === team || m.t2 === team);
            if (match && match.winner) {
                if (match.winner !== team) {
                    teamStatuses[team].status = "Eliminated";
                }
            }
        }
    });

    qfTeams.forEach(team => {
        if (teamStatuses[team]) {
            teamStatuses[team].round = "Quarter-Finals";
            const match = Object.values(bkt.qf).find(m => m.t1 === team || m.t2 === team);
            if (match && match.winner) {
                if (match.winner !== team) {
                    teamStatuses[team].status = "Eliminated";
                }
            }
        }
    });

    sfTeams.forEach(team => {
        if (teamStatuses[team]) {
            teamStatuses[team].round = "Semi-Finals";
            const match = Object.values(bkt.sf).find(m => m.t1 === team || m.t2 === team);
            if (match && match.winner) {
                if (match.winner !== team) {
                    teamStatuses[team].round = "3rd Place Play-off";
                }
            }
        }
    });

    const m103 = bkt.m103;
    if (m103 && (m103.t1 || m103.t2)) {
        if (m103.t1 && teamStatuses[m103.t1]) teamStatuses[m103.t1].round = "3rd Place Play-off";
        if (m103.t2 && teamStatuses[m103.t2]) teamStatuses[m103.t2].round = "3rd Place Play-off";
        if (m103.winner) {
            const loser = m103.winner === m103.t1 ? m103.t2 : m103.t1;
            if (teamStatuses[m103.winner]) {
                teamStatuses[m103.winner].round = "3rd Place";
                teamStatuses[m103.winner].status = "Completed";
            }
            if (loser && teamStatuses[loser]) {
                teamStatuses[loser].round = "4th Place";
                teamStatuses[loser].status = "Completed";
            }
        }
    }

    const m104 = bkt.m104;
    if (m104 && (m104.t1 || m104.t2)) {
        if (m104.t1 && teamStatuses[m104.t1]) teamStatuses[m104.t1].round = "Final";
        if (m104.t2 && teamStatuses[m104.t2]) teamStatuses[m104.t2].round = "Final";
        if (m104.winner) {
            const runnerUp = m104.winner === m104.t1 ? m104.t2 : m104.t1;
            if (teamStatuses[m104.winner]) {
                teamStatuses[m104.winner].round = "Champion 🏆";
                teamStatuses[m104.winner].status = "Completed";
            }
            if (runnerUp && teamStatuses[runnerUp]) {
                teamStatuses[runnerUp].round = "Runner-Up";
                teamStatuses[runnerUp].status = "Completed";
            }
        }
    }

    Object.keys(GROUPS_META).forEach(g => {
        const standings = calcStandings(g);
        const matchesPlayed = standings.some(r => r.p > 0);
        const groupDone = standings.every(r => r.p === 3);
        if (matchesPlayed) {
            standings.forEach(row => {
                if (!r32Teams.has(row.t) && teamStatuses[row.t]) {
                    if (groupDone) {
                        teamStatuses[row.t].status = "Eliminated";
                    }
                }
            });
        }
    });

    return teamStatuses;
}

function renderTeams() {
    const statuses = getTeamStatuses();
    const list = document.getElementById("teams-list");
    if (!list) return;

    list.innerHTML = Object.values(statuses)
        .sort((a, b) => b.rank - a.rank)
        .map((t, i) => {
            const isActive = t.status === "Active";
            const isCompleted = t.status === "Completed";
            const statusColor = isCompleted ? "var(--gold)" : isActive ? "var(--green)" : "var(--muted)";
            const statusBg = isCompleted ? "#12100a" : isActive ? "#082010" : "rgba(255,255,255,0.02)";
            const statusBorder = isCompleted ? "var(--gold2)" : isActive ? "#1a4020" : "var(--border)";
            const roundBadgeColor = t.round.includes("Champion") ? "var(--gold)" :
                                   t.round.includes("Runner") ? "var(--purple)" :
                                   t.round.includes("3rd") || t.round.includes("4th") ? "var(--blue)" :
                                   t.round.includes("Final") ? "var(--purple)" :
                                   t.round.includes("Semi") ? "var(--orange)" :
                                   t.round.includes("Quarter") ? "var(--green)" :
                                   t.round.includes("Round of 16") ? "var(--blue)" :
                                   t.round.includes("Round of 32") ? "var(--purple)" : "var(--muted)";

            return `<div style="background:var(--bg2);border:1px solid ${statusBorder};border-radius:10px;padding:12px;display:flex;flex-direction:column;gap:6px;transition:transform 0.15s, border-color 0.15s;position:relative" class="team-status-card">
                <div style="display:flex;align-items:center;justify-content:space-between">
                    <span style="font-size:22px">${F(t.team)}</span>
                    <span class="badge" style="background:${statusBg};border:1px solid ${statusBorder};color:${statusColor}">${t.status.toUpperCase()}</span>
                </div>
                <div style="font-size:14px;font-weight:700;color:var(--text);margin-top:2px">${t.team}</div>
                <div style="display:flex;align-items:center;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:2px">
                    <span>Group ${t.group}</span>
                    <span>ELO Rank: <strong style="color:var(--gold);font-family:'JetBrains Mono',monospace">${t.rank}</strong></span>
                </div>
                <div style="margin-top:6px;border-top:1px solid var(--border);padding-top:6px;display:flex;align-items:center;justify-content:space-between">
                    <span style="font-size:10px;color:var(--muted)">Current Round:</span>
                    <span class="badge" style="background:rgba(255,255,255,0.03);border:1px solid var(--border);color:${roundBadgeColor};font-weight:700">${t.round}</span>
                </div>
            </div>`;
        }).join("");
}

// ── BOOT ─────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => {
    USER_RESULTS = loadLS("wc26_user_results", []);
    applyTheme();
    updateNotifBtn();

    const headerRight = document.querySelector(".header-right");
    if (headerRight) {
        const extra = document.createElement("div");
        extra.style.cssText = "display:flex;gap:6px;align-items:center;margin-top:4px";
        extra.innerHTML = `
      <button id="theme-btn" class="notif-btn" onclick="toggleTheme()" style="font-size:11px">
        ${DARK_MODE ? '<i data-lucide="sun" class="icon-inline"></i>Light' : '<i data-lucide="moon" class="icon-inline"></i>Dark'}
      </button>
      <button class="notif-btn" onclick="sharepicks()" style="font-size:11px"><i data-lucide="share-2" class="icon-inline"></i>Share Picks</button>
      <span style="font-size:9px;color:var(--muted)">Shortcuts: 1-9 tabs · R refresh</span>`;
        headerRight.appendChild(extra);
    }

    fetchData();
    if (window.StandingsService) {
        StandingsService.init();
    }
    startCountdown();
});

// ── MULTI-TAB SYNCHRONIZATION ────────────────────────────────
window.addEventListener('storage', (event) => {
    const syncKeys = [
        "wc26_picks",
        "wc26_user_results",
        "wc26_mv",
        "wc26_bkt_proj",
        "wc26_notif",
        "wc26_dark",
        "wc26_standings_data",
        "wc26_standings_time"
    ];

    if (!syncKeys.includes(event.key)) return;

    console.log(`[Storage Sync] Key "${event.key}" changed in another tab. Syncing state...`);

    if (event.key === "wc26_picks") {
        PICKS = loadLS("wc26_picks", {});
        renderAll();
    } else if (event.key === "wc26_user_results") {
        USER_RESULTS = loadLS("wc26_user_results", []);
        ST.results = mergeResults(mergeResults(FALLBACK_RESULTS, API_RESULTS_CACHE), USER_RESULTS);
        runSimulation();
        resolveUpcomingPlaceholderMatches();
        renderAll();
    } else if (event.key === "wc26_mv") {
        MODEL_V = loadLS("wc26_mv", 1);
        renderAll();
    } else if (event.key === "wc26_bkt_proj") {
        SHOW_PROJECTED_BRACKET = loadLS("wc26_bkt_proj", true);
        renderAll();
    } else if (event.key === "wc26_notif") {
        NOTIF_ENABLED = loadLS("wc26_notif", false);
        updateNotifBtn();
    } else if (event.key === "wc26_dark") {
        DARK_MODE = loadLS("wc26_dark", true);
        applyTheme();
        const btn = document.getElementById("theme-btn");
        if (btn) {
            btn.innerHTML = DARK_MODE ? `<i data-lucide="sun" class="icon-inline"></i>Light` : `<i data-lucide="moon" class="icon-inline"></i>Dark`;
            if (window.lucide) window.lucide.createIcons();
        }
    } else if (event.key === "wc26_standings_data" || event.key === "wc26_standings_time") {
        if (window.StandingsService) {
            const cachedData = localStorage.getItem("wc26_standings_data");
            const cachedTime = localStorage.getItem("wc26_standings_time");
            if (cachedData && cachedTime) {
                try {
                    window.StandingsService.data = JSON.parse(cachedData);
                    window.StandingsService.lastUpdated = new Date(parseInt(cachedTime));
                    renderAll();
                } catch (err) {
                    console.warn("Failed to parse cached standings on sync:", err);
                }
            }
        }
    }
});
