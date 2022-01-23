var roll_sequence = []
localStorage.setItem("roll_sequence", JSON.stringify(roll_sequence));
localStorage.setItem("point_on", null)
localStorage.setItem("pass", null)

let bankroll = 500
localStorage.setItem("bankroll", bankroll)
document.getElementById("bankroll").textContent += bankroll

const payouts = new Map()
payouts.set(4, 9 / 5)
payouts.set(5, 7 / 5)
payouts.set(6, 7 / 6)
payouts.set(8, 7 / 6)
payouts.set(9, 7 / 5)
payouts.set(10, 9 / 5)

function payout(number, bet) {
    return bet * payouts.get(number)
}

function diceRoll() {
    return 1 + Math.floor(Math.random() * 6)
}

function checkWin() {
    var winnings = 50
    return winnings
}

function dieRoll() {
    var dieRes = diceRoll() + diceRoll()

    console.log(dieRes)

    var roll_sequence = JSON.parse(localStorage.getItem("roll_sequence"));
    roll_sequence.push(dieRes)
    localStorage.setItem("roll_sequence", JSON.stringify(roll_sequence));
    document.getElementById("roll-result").textContent = dieRes
    document.getElementById("roll-sequence").textContent = roll_sequence
    incrementNumberOccurence(parseInt(dieRes))
    return dieRes
}

function clearRollSequence() {
    var roll_sequence = []
    localStorage.setItem("roll_sequence", JSON.stringify(roll_sequence));
    document.getElementById("roll-result").textContent = null
    document.getElementById("roll-sequence").textContent = null
    resetChart()
    var bankroll = 500
    localStorage.setItem("bankroll", bankroll)
}

function betPassLine() {
    var bet = 25
    var current_bet = JSON.parse(localStorage.getItem("pass"))
    if (current_bet == null) {
        localStorage.setItem("pass", bet)
        console.log("Setting pass to ", bet)
    } else {
        var new_wager = parseInt(current_bet) + parseInt(bet)
        console.log("New wager", new_wager)
        localStorage.setItem("pass", new_wager)
    }
    var bankroll = JSON.parse(localStorage.getItem("bankroll"))
    localStorage.setItem("bankroll", bankroll - bet)
    document.getElementById("passline").style.backgroundColor = "pink"
    document.getElementById("passline").style.color = "black"
    document.getElementById("passline").textContent = "Pass Line " + localStorage.getItem("pass")
    document.getElementById("bankroll").textContent = "Bank Roll : " + (bankroll - bet)

}

function play() {
    var pass_bet = JSON.parse(localStorage.getItem("pass"))
    if (pass_bet == null) {
        alert("You haven't placed a pass bet. Placing one for you.")
        betPassLine()
    }
    var res = dieRoll()
    var res_string = res.toString()
    var point_on = JSON.parse(localStorage.getItem("point_on"))
    var bankroll = JSON.parse(localStorage.getItem("bankroll"))
    var pass_bet = JSON.parse(localStorage.getItem("pass"))
    if (point_on == null) {
        if ([7, 11].includes(res)) {
            console.log("Won", pass_bet)
            localStorage.setItem("bankroll", Math.floor(bankroll + (pass_bet * 2)))
            localStorage.setItem("pass", null)
            document.getElementById("passline").style.backgroundColor = "#0c104e"
            document.getElementById("passline").style.color = "white"
            document.getElementById("bankroll").textContent = "Bank Roll : " + (Math.floor(bankroll + (pass_bet * 2)))
            document.getElementById("passline").textContent = "Pass Line"
        } else if ([2, 3, 12].includes(res)) {
            console.log("Lost", pass_bet)
            document.getElementById("passline").style.backgroundColor = "#0c104e"
            document.getElementById("passline").style.color = "gold"
            document.getElementById("passline").textContent = "Pass Line"
            localStorage.setItem("pass", null)
        } else {
            localStorage.setItem("point_on", res)
            document.getElementById(res_string).style.backgroundColor = "pink"

        }
    } else {
        if (res == point_on) {
            var point_on_str = point_on.toString()
            localStorage.setItem("bankroll", Math.floor(bankroll + payout(res, pass_bet) + pass_bet))
            document.getElementById("bankroll").textContent = "Bank Roll : " + Math.floor(bankroll + payout(res, pass_bet) + pass_bet)
            document.getElementById(point_on_str).style.backgroundColor = "#0c104e"
            document.getElementById(point_on_str).style.color = "gold"
            document.getElementById("passline").style.backgroundColor = "#0c104e"
            document.getElementById("passline").style.color = "gold"
            document.getElementById("passline").textContent = "Pass Line"
            localStorage.setItem("point_on", null)
            localStorage.setItem("pass", null)
        } else if (res == 7) {
            var point_on_str = point_on.toString()
            document.getElementById(point_on_str).style.backgroundColor = "#0c104e"
            document.getElementById(point_on_str).style.color = "gold"
            document.getElementById("passline").style.backgroundColor = "#0c104e"
            document.getElementById("passline").style.color = "gold"
            document.getElementById("passline").textContent = "Pass Line"
            localStorage.setItem("point_on", null)
            localStorage.setItem("pass", null)
        }
    }
}


const data = {
    labels: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    datasets: [{
        label: 'Roll Number Frequency',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)'
        ],
        borderWidth: 1
    }]
};

const config = {
    type: 'bar',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    },
};

const myChart = new Chart(
    document.getElementById('myChart'),
    config
);

function incrementNumberOccurence(label) {
    myChart.data.datasets[0].data[label - 2] += 1
    myChart.update();
};

function resetChart() {
    myChart.data.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    myChart.update();
}