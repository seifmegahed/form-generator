# Contribution Guidelines

Thank you for your interest in contributing to the React Form Generator project! We appreciate your help in improving this tool. Before you begin, please take a moment to review the following guidelines.

## Getting Started

1. **Fork the Repository**
   - Start by forking the repository to your GitHub account.
   - Clone the forked repository to your local machine.

     ```bash
     git clone https://github.com/seifmegahed/form-generator.git
     cd form-generator
     ```

2. **Set Up the Environment**
   - Make sure you have Node.js installed.
   - Install the necessary dependencies:

     ```bash
     cd ~/apps/example
     pnpm install

     cd ~/cli
     pnpm install

     ```



3. **Run the Development Server**
   - Start the development server to test your changes locally:

     ```bash
     cd ~/apps/example
     pnpm run dev

     cd ~/cli
     pnpm run dev
     ```

## How to Contribute

### Reporting Issues
- If you find a bug or have a feature request, please open an issue in the GitHub repository.
- Clearly describe the issue or feature request with as much detail as possible.

### Proposing Changes
1. **Create a New Branch**
   - Create a branch for your changes based on the `main` branch:

     ```bash
     git checkout -b feature/your-feature-name
     ```

2. **Make Your Changes**
   - Implement your changes and make sure they align with the project’s coding standards.
   - add tests as needed.

3. **Commit Your Changes**
   - Write clear and concise commit messages.
   - Follow this format: `type: short description`, e.g., `fix: corrected form validation error`.

     ```bash
     git commit -m "feat: add new field type support"
     ```

4. **Push Your Changes**
   - Push your branch to your forked repository:

     ```bash
     git push origin feature/your-feature-name
     ```

5. **Open a Pull Request**
   - Go to the original repository and open a pull request (PR) from your branch.
   - Clearly describe the changes you made and why they are necessary.

### Code Style

- Follow the existing coding style and conventions.
- Use TypeScript for all components and utilities.
- Run `pnpm run lint` before submitting your changes to ensure code consistency.

### Documentation
- If your changes introduce new features, update the relevant documentation.
- Make sure the `README.md` file and any other relevant docs reflect your changes.
