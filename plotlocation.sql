-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2024 at 01:39 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `plotlocation`
--

-- --------------------------------------------------------

--
-- Table structure for table `bihargayatekarisikander`
--

CREATE TABLE `bihargayatekarijanta` (
  `sno` int(11) NOT NULL,
  `plotno` int(11) NOT NULL,
  `corner1latitude` double NOT NULL,
  `corner1longitude` double NOT NULL,
  `corner2latitude` double NOT NULL,
  `corner2longitude` double NOT NULL,
  `corner3latitude` double NOT NULL,
  `corner3longitude` double NOT NULL,
  `corner4latitude` double NOT NULL,
  `corner4longitude` double NOT NULL,
  `corner5latitude` double NOT NULL,
  `corner5longitude` double NOT NULL,
  `corner6latitude` double NOT NULL,
  `corner6longitude` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bihargayatekarijanta`
--

INSERT INTO `bihargayatekarijanta` (`sno`, `plotno`, `corner1latitude`, `corner1longitude`, `corner2latitude`, `corner2longitude`, `corner3latitude`, `corner3longitude`, `corner4latitude`, `corner4longitude`, `corner5latitude`, `corner5longitude`, `corner6latitude`, `corner6longitude`) VALUES
(1, 1, 24.940651, 84.846202, 24.94067, 84.846654, 24.941071, 84.8463314, 24.941174, 84.846856, 24.940909, 84.84697, 0, 0),
(2, 2, 24.940651, 84.846202, 24.94067, 84.846654, 24.940384, 84.846671, 24.940318, 84.846137, 0, 0, 0, 0),
(3, 3, 24.940651, 84.846202, 24.94067, 84.846654, 24.940384, 84.846671, 24.940318, 84.846137, 24.941524, 84.846238, 24.941734, 84.847079);

-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bihargayatekarijanta`
--
ALTER TABLE `bihargayatekarijanta`
  ADD PRIMARY KEY (`sno`);

--
-- Indexes for table `selector`
--

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `selector`
--

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
