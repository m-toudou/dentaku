"use strict";

// 出力履歴の区切り文字
const HISTORY_DELIMITER = " ";
// 演算子の一覧
const CALC_LIST = ["+", "-", "*", "/", "="];
// イコール演算子
const EQUAL = "=";

// 出力結果の編集
const dentaku_modifyInputText = (str) => {
  const exitMonitorResultInput = document.getElementById(
    "dentaku_main_exitMonitor_result_input"
  );
  exitMonitorResultInput.value = str;
};

// 出力結果の追加
const dentaku_appendInputText = (str) => {
  const exitMonitorResultInput = document.getElementById(
    "dentaku_main_exitMonitor_result_input"
  );
  exitMonitorResultInput.value += str;
};

// 出力結果の取得
const dentaku_getInputTextVal = () => {
  const exitMonitorResultInput = document.getElementById(
    "dentaku_main_exitMonitor_result_input"
  );
  return exitMonitorResultInput.value;
};

// 出力履歴への演算子追加
const dentaku_addOpeHistoryText = (operator) => {
  if (!CALC_LIST.includes(operator)) {
    console.error("不明な演算子:" + operator);
  }
  const exitMonitorResultHistory = document.getElementById(
    "dentaku_main_exitMonitor_resultHistory"
  );
  exitMonitorResultHistory.textContent +=
    HISTORY_DELIMITER + operator + HISTORY_DELIMITER;
};

// 出力履歴への数字追加
const dentaku_addNumHistoryText = (numStr) => {
  const exitMonitorResultHistory = document.getElementById(
    "dentaku_main_exitMonitor_resultHistory"
  );
  exitMonitorResultHistory.textContent += numStr;
};

// 出力結果の取得
const dentaku_getHistoryTextVal = () => {
  const exitMonitorResultHistory = document.getElementById(
    "dentaku_main_exitMonitor_resultHistory"
  );
  return exitMonitorResultHistory.innerText;
};

// 出力結果,出力履歴の削除
const dentaku_deleteAllHistoryAndInput = () => {
  const exitMonitorResultInput = document.getElementById(
    "dentaku_main_exitMonitor_result_input"
  );
  const exitMonitorResultHistory = document.getElementById(
    "dentaku_main_exitMonitor_resultHistory"
  );
  exitMonitorResultInput.value = 0;
  exitMonitorResultHistory.innerText = "";
};

// ========================================================================

// 入力した数字の追加
const dentaku_putNumber = (number) => {
  const beforeVal = dentaku_getInputTextVal();
  let rawHistoryVal = dentaku_getHistoryTextVal().split(HISTORY_DELIMITER);
  if (rawHistoryVal.length === 1) {
    // 出力結果が0の場合は上書き
    if (beforeVal === "0") {
      dentaku_modifyInputText(number);
      if (number !== 0) {
        dentaku_addNumHistoryText(number);
      }
    } else {
      dentaku_appendInputText(number);
      dentaku_addNumHistoryText(number);
    }
  } else if (rawHistoryVal.length === 2) {
    if (rawHistoryVal[1] === EQUAL) {
      dentaku_modifyInputText(number);
      dentaku_addNumHistoryText(number);
    } else {
      dentaku_modifyInputText(number);
      dentaku_addNumHistoryText(number);
    }
  } else if (rawHistoryVal.length === 3) {
    // 出力結果が0の場合は上書き
    if (beforeVal === "0") {
      dentaku_modifyInputText(number);
      // 演算対象の数字に0がある場合(01等にとなるのを解消)
      dentaku_deleteAllHistoryAndInput();
      dentaku_modifyInputText(number);
      dentaku_addNumHistoryText(rawHistoryVal[0]);
      dentaku_addOpeHistoryText(rawHistoryVal[1]);
      dentaku_addNumHistoryText(number);
    } else {
      dentaku_appendInputText(number);
      dentaku_addNumHistoryText(number);
    }
  } else if (rawHistoryVal.length === 4) {
    // 演算子を上書き
    dentaku_deleteAllHistoryAndInput();
    dentaku_modifyInputText(number);
    dentaku_addNumHistoryText(beforeVal);
    dentaku_addOpeHistoryText(rawHistoryVal[1]);
    dentaku_addNumHistoryText(number);
  } else {
    console.error("不明な式:" + rawHistoryVal);
  }
};

// ========================================================================

const dentaku_putDecimal = () => {
  alert("dentaku_putDecimal:小数点以下の計算は未実装です");
};

// ========================================================================

// 演算子操作
const dentaku_putOperator = (operator) => {
  const beforeVal = dentaku_getInputTextVal();
  let rawHistoryVal = dentaku_getHistoryTextVal().split(HISTORY_DELIMITER);
  console.log(rawHistoryVal[0]);
  if (!rawHistoryVal[0]) {
    // 入力されていない状態で演算子が入力されたとき
    dentaku_modifyInputText(beforeVal);
    dentaku_addNumHistoryText(beforeVal);
    dentaku_addOpeHistoryText(operator);
  } else if (rawHistoryVal.length === 1) {
    dentaku_addOpeHistoryText(operator);
  } else if (rawHistoryVal.length === 2) {
    // 演算子を上書き
    dentaku_deleteAllHistoryAndInput();
    dentaku_modifyInputText(beforeVal);
    dentaku_addNumHistoryText(beforeVal);
    dentaku_addOpeHistoryText(operator);
  } else if (rawHistoryVal.length === 3) {
    dentaku_deleteAllHistoryAndInput();
    const result = dentaku_calc(
      rawHistoryVal[0],
      rawHistoryVal[1],
      rawHistoryVal[2]
    );
    dentaku_modifyInputText(result);
    dentaku_addNumHistoryText(result);
    dentaku_addOpeHistoryText(operator);
  } else if (rawHistoryVal.length === 4) {
    dentaku_deleteAllHistoryAndInput();
    const result = dentaku_calc(
      rawHistoryVal[0],
      rawHistoryVal[1],
      rawHistoryVal[2]
    );
    dentaku_modifyInputText(result);

    dentaku_addNumHistoryText(result);
    dentaku_addOpeHistoryText(operator);
  } else {
    console.error("不明な式:" + rawHistoryVal);
  }
};

// ========================================================================

const dentaku_calc = (num1, operator, num2) => {
  switch (operator) {
    case CALC_LIST[0]:
      return Number(num1) + Number(num2);
      break;
    case CALC_LIST[1]:
      return Number(num1) - Number(num2);
      break;
    case CALC_LIST[2]:
      return Number(num1) * Number(num2);
      break;
    case CALC_LIST[4]:
      return Number(num2);
      break;
    default:
      console.error("不明な演算子:" + operator);
      break;
  }
};

// ========================================================================

// イコール処理
const dentaku_putResult = () => {
  const beforeVal = dentaku_getInputTextVal();
  let rawHistoryVal = dentaku_getHistoryTextVal().split(HISTORY_DELIMITER);

  if (rawHistoryVal.length === 1) {
  } else if (rawHistoryVal.length === 2) {
    dentaku_deleteAllHistoryAndInput();
    if (rawHistoryVal[1] === EQUAL) {
      // 何もしない
    } else {
      dentaku_modifyInputText(
        dentaku_calc(rawHistoryVal[0], rawHistoryVal[1], rawHistoryVal[0])
      );
      dentaku_addNumHistoryText(rawHistoryVal[0]);
      dentaku_addOpeHistoryText(rawHistoryVal[1]);
      dentaku_addNumHistoryText(rawHistoryVal[0]);
      dentaku_addOpeHistoryText(EQUAL);
    }
  } else if (rawHistoryVal.length === 3) {
    dentaku_deleteAllHistoryAndInput();
    dentaku_modifyInputText(
      dentaku_calc(rawHistoryVal[0], rawHistoryVal[1], rawHistoryVal[2])
    );
    dentaku_addNumHistoryText(rawHistoryVal[0]);
    dentaku_addOpeHistoryText(rawHistoryVal[1]);
    dentaku_addNumHistoryText(rawHistoryVal[2]);
    dentaku_addOpeHistoryText(EQUAL);
  } else if (rawHistoryVal.length === 4 && rawHistoryVal[3] === EQUAL) {
    dentaku_deleteAllHistoryAndInput();
    const afterResultVal = dentaku_calc(
      beforeVal,
      rawHistoryVal[1],
      rawHistoryVal[2]
    );
    dentaku_modifyInputText(afterResultVal);

    dentaku_addNumHistoryText(beforeVal);
    dentaku_addOpeHistoryText(rawHistoryVal[1]);
    dentaku_addNumHistoryText(rawHistoryVal[2]);
    dentaku_addOpeHistoryText(EQUAL);
  } else {
    console.error("不明な式:" + rawHistoryVal);
  }
};

// ========================================================================

const dentaku_deleteEditingHistoryAndInput = () => {
  const beforeVal = dentaku_getInputTextVal();
  let rawHistoryVal = dentaku_getHistoryTextVal().split(HISTORY_DELIMITER);

  if (rawHistoryVal.length === 1) {
    dentaku_deleteAllHistoryAndInput();
  } else if (rawHistoryVal.length === 2) {
    dentaku_modifyInputText(0);
  } else if (rawHistoryVal.length === 3) {
    dentaku_deleteAllHistoryAndInput();
    dentaku_modifyInputText(0);
    dentaku_addNumHistoryText(rawHistoryVal[0]);
    dentaku_addOpeHistoryText(rawHistoryVal[1]);
  } else if (rawHistoryVal.length === 4 && rawHistoryVal[3] === EQUAL) {
    dentaku_deleteAllHistoryAndInput();
    dentaku_modifyInputText(0);

    dentaku_addNumHistoryText(beforeVal);
    dentaku_addOpeHistoryText(rawHistoryVal[1]);
  } else {
    console.error("不明な式:" + rawHistoryVal);
  }
};

// ========================================================================

const dentaku_backspaceHistoryAndInput = () => {
  const beforeVal = dentaku_getInputTextVal();
  let rawHistoryVal = dentaku_getHistoryTextVal().split(HISTORY_DELIMITER);

  if (rawHistoryVal.length === 1) {
    dentaku_deleteAllHistoryAndInput();
    if (beforeVal.length !== 1) {
      const result = beforeVal.slice(0, beforeVal.length - 1);
      dentaku_modifyInputText(result);

      dentaku_addNumHistoryText(result);
    }
  } else if (rawHistoryVal.length === 2) {
    dentaku_modifyInputText(0);
  } else if (rawHistoryVal.length === 3) {
    dentaku_deleteAllHistoryAndInput();

    dentaku_addNumHistoryText(rawHistoryVal[0]);
    dentaku_addOpeHistoryText(rawHistoryVal[1]);

    if (beforeVal.length !== 1) {
      const result = beforeVal.slice(0, beforeVal.length - 1);
      dentaku_modifyInputText(result);

      dentaku_addNumHistoryText(result);
    }
  } else if (rawHistoryVal.length === 4 && rawHistoryVal[3] === EQUAL) {
    dentaku_deleteAllHistoryAndInput();
    dentaku_modifyInputText(0);

    dentaku_addNumHistoryText(beforeVal);
    dentaku_addOpeHistoryText(rawHistoryVal[1]);
  } else {
    console.error("不明な式:" + rawHistoryVal);
  }
};

// ========================================================================

// イベントハンドラ登録
document.addEventListener("DOMContentLoaded", () => {
  // ナンバーの設定
  const number1Button = document.getElementById("dentaku_menu_ctrl_number_1");
  const number2Button = document.getElementById("dentaku_menu_ctrl_number_2");
  const number3Button = document.getElementById("dentaku_menu_ctrl_number_3");
  const number4Button = document.getElementById("dentaku_menu_ctrl_number_4");
  const number5Button = document.getElementById("dentaku_menu_ctrl_number_5");
  const number6Button = document.getElementById("dentaku_menu_ctrl_number_6");
  const number7Button = document.getElementById("dentaku_menu_ctrl_number_7");
  const number8Button = document.getElementById("dentaku_menu_ctrl_number_8");
  const number9Button = document.getElementById("dentaku_menu_ctrl_number_9");
  const number0Button = document.getElementById("dentaku_menu_ctrl_number_0");
  const numberDotButton = document.getElementById(
    "dentaku_menu_ctrl_number_dot"
  );

  number1Button.addEventListener("click", () => {
    dentaku_putNumber(1);
  });
  number2Button.addEventListener("click", () => {
    dentaku_putNumber(2);
  });
  number3Button.addEventListener("click", () => {
    dentaku_putNumber(3);
  });
  number4Button.addEventListener("click", () => {
    dentaku_putNumber(4);
  });
  number5Button.addEventListener("click", () => {
    dentaku_putNumber(5);
  });
  number6Button.addEventListener("click", () => {
    dentaku_putNumber(6);
  });
  number7Button.addEventListener("click", () => {
    dentaku_putNumber(7);
  });
  number8Button.addEventListener("click", () => {
    dentaku_putNumber(8);
  });
  number9Button.addEventListener("click", () => {
    dentaku_putNumber(9);
  });
  number0Button.addEventListener("click", () => {
    dentaku_putNumber(0);
  });
  numberDotButton.addEventListener(
    "click",
    () => {
      dentaku_putDecimal();
    },
    { once: true }
  );

  // 四則演算の設定
  const operatorDivideButton = document.getElementById(
    "dentaku_menu_ctrl_calc_divide"
  );
  const operatorMultiplyButton = document.getElementById(
    "dentaku_menu_ctrl_calc_multiply"
  );
  const operatorMinusButton = document.getElementById(
    "dentaku_menu_ctrl_calc_minus"
  );
  const operatorPlusButton = document.getElementById(
    "dentaku_menu_ctrl_calc_plus"
  );
  const operatorEqualButton = document.getElementById(
    "dentaku_menu_ctrl_calc_equal"
  );

  operatorDivideButton.addEventListener(
    "click",
    () => {
      alert("javascriptでの割り算は未実装です。");
    },
    { once: true }
  );
  operatorMultiplyButton.addEventListener("click", () => {
    dentaku_putOperator("*");
  });
  operatorMinusButton.addEventListener("click", () => {
    dentaku_putOperator("-");
  });
  operatorPlusButton.addEventListener("click", () => {
    dentaku_putOperator("+");
  });
  operatorEqualButton.addEventListener("click", () => {
    dentaku_putResult();
  });

  // 出力操作の設定
  const controlResultCEButton = document.getElementById(
    "dentaku_menu_ctrl_result_ce"
  );
  const controlResultCButton = document.getElementById(
    "dentaku_menu_ctrl_result_c"
  );
  const controlResultBackspaceButton = document.getElementById(
    "dentaku_menu_ctrl_result_backspace"
  );

  controlResultCEButton.addEventListener("click", () => {
    dentaku_deleteEditingHistoryAndInput();
  });

  controlResultCButton.addEventListener("click", () => {
    dentaku_deleteAllHistoryAndInput();
  });

  controlResultBackspaceButton.addEventListener("click", () => {
    dentaku_backspaceHistoryAndInput();
  });
});



