import React, {Component} from 'react';
import Calendar from "react-calendar";
import {connect} from 'react-redux';
import {getDiaryEntries} from "../action-creators/diaryEntryActionCreator";
import {BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar} from 'recharts';


class ViewDiaryEntries extends Component {
    constructor(props) {
        super(props);

        this.keyCount = 0;
        this.getKey = this.getKey.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    state = {
        date: null,
        multipleSelection: false,
        show: "kcal",
        data: [
            {
                kcal: 88,
                protein: 11,
                carbs: 8,
                fat: 4,
                fibre: 34,
                goalKcal: 2462,
                goalProtein: 289,
                goalCarbs: 292,
                goalFat: 296,
                goalFibre: 266,
                date: '14. 1. 2020'
            },
            {
                kcal: 184,
                protein: 4,
                carbs: 10,
                fat: 3,
                fibre: 11,
                goalKcal: 2366,
                goalProtein: 296,
                goalCarbs: 290,
                goalFat: 297,
                goalFibre: 289,
                date: '15. 1. 2020'
            },
            {
                kcal: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fibre: 0,
                goalKcal: 2550,
                goalProtein: 300,
                goalCarbs: 300,
                goalFat: 300,
                goalFibre: 300,
                date: '16. 1. 2020'
            },
            {
                kcal: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fibre: 0,
                goalKcal: 2550,
                goalProtein: 300,
                goalCarbs: 300,
                goalFat: 300,
                goalFibre: 300,
                date: '17. 1. 2020'
            }


        ]

    };

    //Generates unique keys for html elements
    getKey = () => {
        return this.keyCount++;
    };

    handleChange = (date) => {
        console.log(date);
        this.setState({date})
    };

    handleCheckbox = () => {
        this.setState({
            multipleSelection: !this.state.multipleSelection,
            date: null
        })
    };

    handleSubmit = () => {
        if (this.state.date !== null) {
            this.props.getDiaryEntries(JSON.stringify(this.state.date));
        } else {
            console.log("Musite zvolit datum nebo data v kalendari")
        }
    };

    handleSelect = (event) => {
        this.setState({show: event.target.value})
    };

    renderLegendText(value, entry){
        let noRender = ["goalKcal","goalProtein","goalCarbs","goalFibre","goalFat"];
        const { color } = entry;

        if(value && !noRender.includes(value)){
            return <span style={{ color }}>{value}</span>;
        }

        return null;
    }

    render() {
        //Doesn't show chart before user submits date(s) of the diaryEntry(/ies) or if there are no diaryEntries for the
        //submitted dates
        let displayChart = 'none';
        if (this.state.data.length !== 0) {
            displayChart = 'block';
        }

        //Shows either chart for calories or nutrition values which depends on show attribute of state which user changes
        //with html select tag
        let barsHtml = [];
        if(this.state.show === 'kcal'){
            barsHtml.push(<Bar dataKey="kcal" fill="#18139c" stroke="#18139c" stackId="a" key={this.getKey()} isAnimationActive={false}/>);
            barsHtml.push(<Bar dataKey="goalKcal" fill="none" stroke="#18139c" stackId="a" key={this.getKey()} isAnimationActive={false}/>);
        } else {
            barsHtml.push(<Bar dataKey="carbs" stackId="a" fill="#d67e0f" stroke="#d67e0f" key={this.getKey()} isAnimationActive={false}/>);
            barsHtml.push(<Bar dataKey="goalCarbs" stackId="a" fill="none" stroke="#d67e0f" key={this.getKey()} isAnimationActive={false}/>);
            barsHtml.push(<Bar dataKey="protein" stackId="b" fill="#ab1d1d" stroke="#ab1d1d" key={this.getKey()} isAnimationActive={false}/>);
            barsHtml.push(<Bar dataKey="goalProtein" stackId="b" fill="none" stroke="#ab1d1d" key={this.getKey()} isAnimationActive={false}/>);
            barsHtml.push(<Bar dataKey="fibre" stackId="c" fill="#1c7800" stroke="#1c7800" key={this.getKey()} isAnimationActive={false}/>);
            barsHtml.push(<Bar dataKey="goalFibre" stackId="c" fill="none" stroke="#1c7800" key={this.getKey()} isAnimationActive={false}/>);
            barsHtml.push(<Bar dataKey="fat" stackId="d" fill="saddlebrown" stroke="saddlebrown" key={this.getKey()} isAnimationActive={false}/>);
            barsHtml.push(<Bar dataKey="goalFat" stackId="d" fill="none" stroke="saddlebrown" key={this.getKey()} isAnimationActive={false}/>);
        }

        return (
            <div>
                Select more than one day <input type="checkbox" onClick={this.handleCheckbox}/>
                <Calendar onChange={this.handleChange} selectRange={this.state.multipleSelection}
                          value={this.state.date}/>
                <button onClick={this.handleSubmit}>Submit</button>
                <button onClick={() => {console.log(this.props.searchedDiaryEntries)}}>Debug</button>

                <select value={this.state.show} onChange={this.handleSelect}>
                    <option value="kcal">Energeticka hodnota</option>
                    <option value="nutrients">Nutricni hodnoty</option>
                </select>

                <div style={{display: displayChart}}>
                    <BarChart width={730} height={250} data={this.state.data}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date"/>
                        <YAxis/>
                        <Tooltip content={<CustomTooltip />}/>
                        <Legend formatter={this.renderLegendText}/>
                        {barsHtml}
                    </BarChart>;
                </div>

            </div>
        )
    }
}

const handleInflection = (number) => {
    let inflection;
    if(parseInt(number) === 1){
        inflection = "gram";
    } else if(parseInt(number) > 1 && parseInt(number) < 5){
        inflection = "gramy"
    } else {
        inflection = "gramů"
    }

    return inflection;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload.length===2) {
        return (
            <div className="custom-tooltip" style={{"background-color":"white"}}>
                <p className="label">{`${label}:`}</p>
                <p>{`Energie: Zkonzumováno ${payload[0].value} kcal, do cíle zbývá ${payload[1].value} kcal`}</p>
            </div>
        );
    } else if(active && payload.length===8){
        let names = ["Sacharidy", "Bílkoviny", "Vláknina", "Tuky"];
        let html = [];
        for(let i = 0; i<8; i+=2){
            html.push(<p key={i}>{`${names[i/2]}: Zkonzumováno ${payload[i].value} ${handleInflection(payload[i].value)},
              do cíle zbývá ${payload[i+1].value} ${handleInflection(payload[i+1].value)}`}</p>);
        }

        return (
            <div className="custom-tooltip" style={{"background-color":"white"}}>
                <p className="label">{`${label}:`}</p>
                {html}
            </div>
        );
    }

    return null;
};

const mapDispatchToProps = dispatch => ({
    getDiaryEntries: (date) => {
        dispatch(getDiaryEntries(date));
    },
});

const mapStateToProps = state => ({
    searchedDiaryEntries: state.searchedDiaryEntries,
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewDiaryEntries);