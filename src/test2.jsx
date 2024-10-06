import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import cherries from './assets/cherries.png'
import lemon from './assets/lemon.svg'
import grape from './assets/grape.svg'
import citrus from './assets/citrus.svg'
import sevens from './assets/777.svg'
import bonus from './assets/bonus.svg'
import diamond from './assets/diamond.svg'
import crabi from './assets/crabi.svg'

const Data = {
    'вишня': [cherries, 1],
    'лимон': [lemon, 2],
    'BONUS': [bonus, 100],
    'цитрус': [citrus, 2],
    'рубин': [diamond, 10],
    '777': [sevens, 50],
    'виноград': [grape, 2],
    'краб': [crabi, 3]
};

const DataKeys = Object.keys(Data)





const MatrixContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 150px);
  grid-gap: 5px;
  align-items: center;
  justify-content: center;
  `;

const Cell = styled.div`
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(${(props) => Data[props.value][0]});
  background-size: cover;
  border: 1px solid black;
  font-size: 40px;
  background-color: gray
`;

const SpinButton = styled.button`
align-self: center;
justify-self: center;
width: 400px;
background-color: black;
color: white;
border: none;
margin-left: 300px;
height: 100px;
&:hover{cursor: pointer}; 
font-size: 50px;
&:disabled {
    cursor: default;
}
`;

const GeneralWrapper = styled.div`
width: 50%;
display: flex;
align-self: center;
flex-direction: column;
margin-left: 400px;
`;

const BalanceDisplay = styled.p`
margin-left: 380px;
color:darkred;
font-size: 90px;

`;

export const Matrix = () => {
    const [balance,setBalance]=useState(window.localStorage.getItem('balance') ? Number(window.localStorage.getItem('balance')) : 1000)
    const [bet,setBet]=useState(null)
    const [disable, setDisable] = useState(false);
    const [betDisableIndex, setBetDisableIndex] = useState(null)
    const startingMatrix=[['цитрус', 'вишня', 'виноград'],['рубин', 'BONUS', '777'],['лимон', 'вишня', 'краб']]
    const bets=[1,2,3,4,5,10]

    const createMatrix = () => {
        return Array.from({ length: 3 }, () =>
            Array.from({ length: 3 }, () => {
                let random = Math.floor(Math.random() * 100) + 1;

                switch (true) {
                    case random < 26: return DataKeys[1]
                    case random < 41: return DataKeys[2]
                    case random < 56: return DataKeys[4]
                    case random < 71: return DataKeys[7]
                    case random < 80: return DataKeys[6]
                    case random < 89: return DataKeys[5]
                    case random < 93: return DataKeys[0]
                    case random <= 100: return DataKeys[3]
                }
            })
        );
    };

    const [matrix, setMatrix] = useState(startingMatrix);


    const Payout = (symbol) => {
        setDisable(true);
        setTimeout(() => {
            setBalance(balance+bet*Data[symbol][1])
            setDisable(false);
            window.localStorage.setItem('balance',balance)
        }, 500);

    };

    const combinationChecker = () => {
        for (let row of matrix) {
            const WinOrNot = new Set(row);
            if (WinOrNot.size === 1) {
                Payout(row[0]);
            }
        }
    };


    useEffect(() => {
        combinationChecker();
    }, [matrix]);

    const onClickHandler = () => {
        setMatrix(createMatrix());
        setBalance(balance-bet)
        window.localStorage.setItem('balance',balance)
    };
    const betChanger=(value,index)=>{
        setBetDisableIndex(index)
        setBet(value)
    }
    return (
        <GeneralWrapper>
            <MatrixContainer>
                {matrix.map((row, rowIndex) =>
                    row.map((value, columnIndex) => (
                        <Cell value={value} key={`${rowIndex}-${columnIndex}`}>
                        </Cell>
                    ))
                )}
                <SpinButton onClick={onClickHandler} disabled={disable} >spin</SpinButton>
            </MatrixContainer>
            <BalanceDisplay>{balance}</BalanceDisplay>
            {bets.map((value,index)=>(
                <button key={index} disabled={betDisableIndex===index} onClick={() => betChanger(value,index)}>{value}</button>
            ))}
        </GeneralWrapper>
    );
};
