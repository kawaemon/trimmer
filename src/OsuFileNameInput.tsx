import React from "react";
import styled from "styled-components";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

type OsuFileNameInputFormat = {
    label: string;
    prop: string;
    size: 1 | 2 | 4 | 8;
};

const OsuFileNameInputs: ReadonlyArray<OsuFileNameInputFormat> = [
    {
        label: "Artist",
        prop: "artist",
        size: 4,
    },
    {
        label: "Title",
        prop: "title",
        size: 8,
    },
    {
        label: "Difficulty Name",
        prop: "diff",
        size: 4,
    },
    {
        label: "Mod",
        prop: "mod",
        size: 2,
    },
    {
        label: "Rank",
        prop: "rank",
        size: 1,
    },
    {
        label: "Acc",
        prop: "acc",
        size: 4,
    },
    {
        label: "PP",
        prop: "pp",
        size: 2,
    },
];

export type OsuFileNameProps = {
    onChange: (name: string) => void;
};

type State = {
    artist: string;
    title: string;
    diff: string;
    mod: string;
    rank: string;
    acc: string;
    pp: string;
};

function formatState(state: State): string {
    const { artist, title, diff, mod, rank, acc, pp } = state;
    let text = "";

    if (artist) text += `${artist} - `;
    if (title) text += `${title} `;
    if (diff) text += `[${diff}] `;
    if (mod) text += `+${mod} `;
    if (rank) text += `${rank} `;
    if (acc) text += `${acc}% `;
    if (pp) text += `${pp}pp`;

    text = text.trim();

    if (text) text += ".mp4";

    return text;
}

const InputWrapper = styled.div`
    width: 100%;
    margin: 10px;
`;

const GridWrapper = styled.div`
    width: 75%;
`;

export function OsuFileNameInput(props: OsuFileNameProps) {
    const [state, setState] = React.useState<State>({
        artist: "",
        title: "",
        diff: "",
        mod: "",
        rank: "",
        acc: "",
        pp: "",
    });

    return (
        <GridWrapper>
            <Grid container spacing={3}>
                {OsuFileNameInputs.map((v) => (
                    <Grid item xs={v.size}>
                        <InputWrapper>
                            <TextField
                                label={v.label}
                                fullWidth
                                onChange={(e) => {
                                    const newState = {
                                        ...state,
                                        [v.prop]: e.target.value,
                                    };
                                    setState(newState);
                                    props.onChange(formatState(newState));
                                }}
                            />
                        </InputWrapper>
                    </Grid>
                ))}
            </Grid>
        </GridWrapper>
    );
}
