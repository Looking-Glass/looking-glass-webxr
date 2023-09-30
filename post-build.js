import fs from "fs"
import path from "path"

const sourceDir = "dist/library"
const targetDir = "dist"

function copyFilesRecursively(source, target) {
	fs.readdirSync(source).forEach((file) => {
		const sourceFile = path.join(source, file)
		const targetFile = path.join(target, file)

		if (fs.lstatSync(sourceFile).isDirectory()) {
			if (!fs.existsSync(targetFile)) {
				fs.mkdirSync(targetFile)
			}

			copyFilesRecursively(sourceFile, targetFile)
		} else {
			fs.copyFileSync(sourceFile, targetFile)
		}
	})
}

function deleteFilesRecursively(directory) {
	if (fs.existsSync(directory)) {
		fs.readdirSync(directory).forEach((file, index) => {
			const currentPath = path.join(directory, file)

			if (fs.lstatSync(currentPath).isDirectory()) {
				deleteFilesRecursively(currentPath)
			} else {
				fs.unlinkSync(currentPath)
			}
		})

		fs.rmdirSync(directory)
	}
}

copyFilesRecursively(sourceDir, targetDir)
deleteFilesRecursively(sourceDir)
