import React from "react";
import styled from "styled-components";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

export type Output = {
    inputPath: string;
    outputPath: string;
};

type PathInputProps = {
    onChange: (path: Output) => void;
};

type State = {
    input: string;
    output: string;
};

function stateToOutput(state: State): Output {
    return {
        inputPath: state.input,
        outputPath: state.output,
    };
}

export function PathInput(props: PathInputProps) {
    const [state, setState] = React.useState<State>({ input: "", output: "" });

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="入力フォルダ"
                    onChange={(e) => {
                        const newState: State = {
                            ...state,
                            input: e.target.value,
                        };
                        setState(newState);
                        props.onChange(stateToOutput(newState));
                    }}
                />
            </Grid>

            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="出力フォルダ"
                    onChange={(e) => {
                        const newState: State = {
                            ...state,
                            output: e.target.value,
                        };
                        setState(newState);
                        props.onChange(stateToOutput(newState));
                    }}
                />
            </Grid>
        </Grid>
    );
}
