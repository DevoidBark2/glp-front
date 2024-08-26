import nextJest from "next/jest";

const createJestConfig = nextJest({
    dir: './'
})

const config = {
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    testEnvironment: "jest-environment-jsdom",
    preset: 'ts-jest',
    verbose: true
}

export default createJestConfig(config)