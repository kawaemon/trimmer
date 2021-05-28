import React, { FC } from "react";
import { useDropzone } from "react-dropzone";

export type FileDropZoneProps = {
	alwaysVisible: boolean;
	onFileDrop: () => void;
};

export const FileDropZone: FC<FileDropZoneProps> = (props) => {
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: props.onFileDrop,
	});

	return <div className=""></div>;
};
