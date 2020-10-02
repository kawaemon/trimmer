import React from "react";
import styled from "styled-components";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { FileDropzone } from "./FileDropzone";
import { Trimmer } from "./Trimmer";

const muiTheme = createMuiTheme({
    palette: {
        type: "dark",
    },
});

const FileDropzoneWrapper = styled.div`
    margin: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const TrimmerWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;

function App() {
    const [file, setFile] = React.useState<File | undefined>(undefined);

    if (file == null) {
        return (
            <FileDropzoneWrapper>
                <FileDropzone onDrop={(f) => setFile(f)} />
            </FileDropzoneWrapper>
        );
    }

    return (
        <TrimmerWrapper>
            <ThemeProvider theme={muiTheme}>
                <Trimmer file={file} onResetFile={(f) => setFile(f)} />
            </ThemeProvider>
        </TrimmerWrapper>
    );
}

export default App;
