import React from "react";

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import styles from "./PathInput.module.css";

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
        <Grid container spacing={2} className={styles.grid}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Path where input files at"
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
                    label="Path where output file is created at"
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
