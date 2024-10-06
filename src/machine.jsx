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



const BetsWrapper = styled.div`
    display:flex;
    margin-left: 170px;
    margin-top: 20px;
`
const BetsButton = styled.button`
    width:100px;
    height:60px;
    background-color: #00001c;
    border: solid 2px grey;
    font-size: 30px;
    color:white;
    cursor: pointer;
    &:disabled{cursor:default;color:green;};
`

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
  background-color: gray;
`
const SpinButton = styled.button`
align-self: center;
justify-self: center;
width: 400px;
background-color:#00001c;
color: white;
border: none;
margin-left: 300px;
height: 100px;
&:hover{cursor: pointer}; 
font-size: 50px;
&:disabled {
    cursor: default;
    color:red
}
border-radius: 30px;
`;

const GeneralWrapper = styled.div`
width: 50%;
display: flex;
align-self: center;
flex-direction: column;
margin-left: 400px;
margin-top: 70px;
`;

const BalanceDisplay = styled.p`
margin-left: 380px;
color:#861532;
font-size: 70px;
position: absolute;
right: 350px;
top:485px;
`
const Text=styled.div`
    color:#861532;
    font-size: 70px;
    margin-left: 215px;
    margin-top: 10px;
`

export const SlotMachine = () => {
    const [balance, setBalance] = useState(window.localStorage.getItem('balance') ? Number(window.localStorage.getItem('balance')) : 1000)
    const [bet, setBet] = useState(null)
    const [spinDisable, setSpinDisable] = useState(true);
    const [betDisableIndex, setBetDisableIndex] = useState(null)
    const startingMatrix = [['цитрус', 'вишня', 'виноград'], ['рубин', 'BONUS', '777'], ['лимон', 'вишня', 'краб']]
    const bets = [1, 2, 3, 4, 5, 10]

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
                    case random < 93: return DataKeys[3]
                    case random <= 100: return DataKeys[0]
                }
            })
        );
    };

    const [matrix, setMatrix] = useState(startingMatrix);


    const Payout = (symbol) => {
        setSpinDisable(true);
        setTimeout(() => {
            setBalance((balance) => {
                const newBalance = balance + bet * Data[symbol][1];
                window.localStorage.setItem('balance', newBalance);
                return newBalance;
            });
            setSpinDisable(false);
        }, 500);
    }

    const combinationChecker = () => {
        let payoutSymbols = []
        
        for (let row of matrix) {
            const WinOrNot = new Set(row);
            if (WinOrNot.size === 1) {
                payoutSymbols.push(row[0])
            }
        }
        
        const diagonal = [new Set([matrix[0][0], matrix[1][1], matrix[2][2]]), new Set([matrix[0][2], matrix[1][1], matrix[2][0]])];
        
        if (diagonal[0].size === 1) {
            payoutSymbols.push(matrix[0][0])
        }
        if (diagonal[1].size === 1) {
            payoutSymbols.push(matrix[0][2]) 
        }
        for(let i=0;i<payoutSymbols.length;i++){
            Payout(payoutSymbols[i])
        }
        if(bet>balance){
            setSpinDisable(true)
        }
    };
    


    useEffect(() => {
        combinationChecker();
    }, [matrix]);

    const onClickHandler = () => {
        setMatrix(createMatrix());
        setBalance(balance - bet)
        window.localStorage.setItem('balance', balance)
    };
    
    const betChanger = (value, index) => {
        setBetDisableIndex(index)
        setBet(value)
        if(bet>balance){
            setSpinDisable(true)
        }
        else{setSpinDisable(false)}
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
                <SpinButton onClick={onClickHandler} disabled={spinDisable} >spin</SpinButton>
            </MatrixContainer>
            <BalanceDisplay>баланс: {balance}</BalanceDisplay>
            <Text>Выберите ставку</Text>
            <BetsWrapper>
                {bets.map((value, index) => (
                    <BetsButton key={index} disabled={betDisableIndex === index} onClick={() => betChanger(value, index)}>{value}</BetsButton>
                ))}
            </BetsWrapper>
        </GeneralWrapper>
    );
};