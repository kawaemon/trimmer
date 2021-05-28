import React, { FC } from "react";
import { FileDropZone } from "../components/FIleDropZone";

const Index: FC = () => (
	<>
		<FileDropZone alwaysVisible={true} onFileDrop={console.log} />
	</>
);

export default Index;
