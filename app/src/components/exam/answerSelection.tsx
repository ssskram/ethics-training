import * as React from "react";
import * as types from "./../../store/types";

type props = {
  examQuestion: types.examQuestion;
  correct: boolean;
  checkAnswer: (correct, answer) => void;
};

const green = {
  borderColor: "#5cb85c",
  borderWidth: "1px",
  boxShadow: "0 1px 2px 0 #8AD38A"
};

export default class Answers extends React.Component<props, any> {
  public render() {
    const selection = (
      <div className="row">
        {this.props.examQuestion.answers.map((answer, key) => {
          // green border applied to correct answer when helper text is thrown
          let greenBorder;
          if (
            this.props.correct == false &&
            answer == this.props.examQuestion.correct
          ) {
            greenBorder = green;
          } else greenBorder = {};

          const clearfix = key & 1 && key != 0;
          return (
            <div key={key}>
              <div className="col-xs-12 col-sm-6">
                <div className=" panel panel-button" style={greenBorder}>
                  <div
                    onClick={() =>
                      this.props.checkAnswer(
                        this.props.examQuestion.correct,
                        answer
                      )
                    }
                    className="panel-body"
                  >
                    <h4>{answer}</h4>
                  </div>
                </div>
              </div>
              {clearfix == true && <div className="clearfix" />}
            </div>
          );
        })}
      </div>
    );

    return (
      <div className="text-center">
        <br />
        {selection}
      </div>
    );
  }
}
