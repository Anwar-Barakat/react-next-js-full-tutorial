import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from '../components/Profile'; // Adjust path if needed

// Mock react-icons/fa
jest.mock('react-icons/fa', () => ({
  FaCamera: () => <div data-testid="mock-fa-camera" />,
}));

// Mock the Tabs component
jest.mock('../components/Tabs', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-tabs">Mock Tabs</div>,
}));

// Declare spies at a scope accessible by both beforeEach and afterEach
let createObjectURLSpy: jest.Mock;
let revokeObjectURLSpy: jest.Mock;
let consoleErrorSpy: jest.SpyInstance;

describe('Profile', () => {
  // Store original global URL functions before all tests in this describe block
  const originalCreateObjectURL = window.URL.createObjectURL;
  const originalRevokeObjectURL = window.URL.revokeObjectURL;

  beforeEach(() => {
    // Mock functions
    window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
    window.URL.revokeObjectURL = jest.fn();

    // Assign spies to the new mock functions
    createObjectURLSpy = window.URL.createObjectURL as jest.Mock;
    revokeObjectURLSpy = window.URL.revokeObjectURL as jest.Mock;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original functions
    window.URL.createObjectURL = originalCreateObjectURL;
    window.URL.revokeObjectURL = originalRevokeObjectURL;
    consoleErrorSpy.mockRestore();
  });

  it('renders correctly with default values', () => {
    render(<Profile />);
    expect(screen.getByAltText('Profile banner')).toHaveAttribute('src', 'https://placehold.co/1500x400/png');
    expect(screen.getByAltText('Profile picture')).toHaveAttribute('src', 'https://placehold.co/100/png');
    expect(screen.getByText('Anwar WebDev')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument();
    expect(screen.getByTestId('mock-tabs')).toBeInTheDocument();
  });

  it('handles valid banner image upload', async () => {
    render(<Profile />);
    const file = new File(['dummy content'], 'test-banner.png', { type: 'image/png' });
    const bannerUploadInput = screen.getByLabelText('Upload banner image').querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(bannerUploadInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalledWith(file);
      expect(screen.getByAltText('Profile banner')).toHaveAttribute('src', 'blob:mock-url');
      expect(screen.queryByText('File size must be less than 5MB')).not.toBeInTheDocument();
      expect(screen.queryByText('Please upload a valid image file (JPEG, PNG, or WebP)')).not.toBeInTheDocument();
    });
  });

  it('handles invalid banner image type', async () => {
    render(<Profile />);
    const file = new File(['dummy content'], 'test-banner.txt', { type: 'text/plain' });
    const bannerUploadInput = screen.getByLabelText('Upload banner image').querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(bannerUploadInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Please upload a valid image file (JPEG, PNG, or WebP)')).toBeInTheDocument();
      expect(createObjectURLSpy).not.toHaveBeenCalled();
    });
  });

  it('handles oversized banner image', async () => {
    render(<Profile />);
    const largeFile = new File(new Array(6 * 1024 * 1024).fill('a'), 'large-banner.png', { type: 'image/png' }); // 6MB
    const bannerUploadInput = screen.getByLabelText('Upload banner image').querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(bannerUploadInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText('File size must be less than 5MB')).toBeInTheDocument();
      expect(createObjectURLSpy).not.toHaveBeenCalled();
    });
  });

  it('handles valid profile image upload', async () => {
    render(<Profile />);
    const file = new File(['dummy content'], 'test-profile.jpg', { type: 'image/jpeg' });
    const profileUploadInput = screen.getByLabelText('Upload profile picture').querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(profileUploadInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalledWith(file);
      expect(screen.getByAltText('Profile picture')).toHaveAttribute('src', 'blob:mock-url');
      expect(screen.queryByText('File size must be less than 5MB')).not.toBeInTheDocument();
      expect(screen.queryByText('Please upload a valid image file (JPEG, PNG, or WebP)')).not.toBeInTheDocument();
    });
  });

  it('handles invalid profile image type', async () => {
    render(<Profile />);
    const file = new File(['dummy content'], 'test-profile.gif', { type: 'image/gif' }); // GIF is not allowed by validateFile
    const profileUploadInput = screen.getByLabelText('Upload profile picture').querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(profileUploadInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText('Please upload a valid image file (JPEG, PNG, or WebP)')).toBeInTheDocument();
      expect(createObjectURLSpy).not.toHaveBeenCalled();
    });
  });

  it('handles oversized profile image', async () => {
    render(<Profile />);
    const largeFile = new File(new Array(6 * 1024 * 1024).fill('a'), 'large-profile.jpg', { type: 'image/jpg' }); // 6MB
    const profileUploadInput = screen.getByLabelText('Upload profile picture').querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(profileUploadInput, { target: { files: [largeFile] } });

    await waitFor(() => {
      expect(screen.getByText('File size must be less than 5MB')).toBeInTheDocument();
      expect(createObjectURLSpy).not.toHaveBeenCalled();
    });
  });

  it('revokes previous object URL when a new banner is uploaded', async () => {
    render(<Profile />);
    const bannerUploadInput = screen.getByLabelText('Upload banner image').querySelector('input[type="file"]') as HTMLInputElement;

    // Upload first image
    const firstFile = new File(['first content'], 'first.png', { type: 'image/png' });
    fireEvent.change(bannerUploadInput, { target: { files: [firstFile] } });
    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalledWith(firstFile);
      expect(screen.getByAltText('Profile banner')).toHaveAttribute('src', 'blob:mock-url');
    });

    // Reset mocks for createObjectURL and revokeObjectURL to track new calls
    createObjectURLSpy.mockClear();
    revokeObjectURLSpy.mockClear();

    // Upload second image
    const secondFile = new File(['second content'], 'second.png', { type: 'image/png' });
    fireEvent.change(bannerUploadInput, { target: { files: [secondFile] } });

    await waitFor(() => {
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url'); // Should revoke the first URL
      expect(createObjectURLSpy).toHaveBeenCalledWith(secondFile);
    });
  });

  it('revokes previous object URL when a new profile picture is uploaded', async () => {
    render(<Profile />);
    const profileUploadInput = screen.getByLabelText('Upload profile picture').querySelector('input[type="file"]') as HTMLInputElement;

    // Upload first image
    const firstFile = new File(['first content'], 'first-profile.png', { type: 'image/png' });
    fireEvent.change(profileUploadInput, { target: { files: [firstFile] } });
    await waitFor(() => {
      expect(createObjectURLSpy).toHaveBeenCalledWith(firstFile);
      expect(screen.getByAltText('Profile picture')).toHaveAttribute('src', 'blob:mock-url');
    });

    // Reset mocks for createObjectURL and revokeObjectURL to track new calls
    createObjectURLSpy.mockClear();
    revokeObjectURLSpy.mockClear();

    // Upload second image
    const secondFile = new File(['second content'], 'second-profile.png', { type: 'image/png' });
    fireEvent.change(profileUploadInput, { target: { files: [secondFile] } });

    await waitFor(() => {
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url'); // Should revoke the first URL
      expect(createObjectURLSpy).toHaveBeenCalledWith(secondFile);
    });
  });
});
