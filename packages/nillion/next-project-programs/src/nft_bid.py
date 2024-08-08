from nada_dsl import *

def nada_main():
    # declare Party
    analysts = [Party(name="Analyst" + str(i)) for i in range(4)]

    # gather predictions from each analyst
    predictions: list[SecretInteger] = [SecretInteger(Input(name="prediction_input" + str(i), party=analysts[i])) for i in range(4)]

    outputs: list[Output] = []

    # calculate the sum of predictions
    totalPrediction = predictions[0] + predictions[1] + predictions[2] + predictions[3]

    # find the highest prediction without revealing individual predictions
    maxPrediction = (
        (predictions[0] > predictions[1]).if_else(
            (predictions[0] > predictions[2]).if_else(
                (predictions[0] > predictions[3]).if_else(predictions[0], predictions[3]),
                (predictions[2] > predictions[3]).if_else(predictions[2], predictions[3])
            ),
            (predictions[1] > predictions[2]).if_else(
                (predictions[1] > predictions[3]).if_else(predictions[1], predictions[3]),
                (predictions[2] > predictions[3]).if_else(predictions[2], predictions[3])
            )
        )
    )

    # output the total prediction
    outputs.append(Output(totalPrediction, "totalPrediction", analysts[0]))

    # output the highest prediction
    for i in range(len(predictions)):
        outputs.append(Output(predictions[i] == maxPrediction, "isMax" + str(i), analysts[0]))

    return outputs