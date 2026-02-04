export default function DailyProgress({ totals, targets }) {
    const getProgress = (current, target) => Math.min((current / target) * 100, 100)

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Daily Progress</h2>

            <div className="space-y-4">
                {/* Calories */}
                <div>
                    <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Calories</span>
                        <span className="text-gray-500">{totals.calories} / 2500 kcal</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                            style={{ width: `${getProgress(totals.calories, 2500)}%` }}
                        />
                    </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-4">
                    {/* Protein */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-blue-700">Protein</span>
                            <span className="text-blue-500">{totals.protein}/{targets.protein}g</span>
                        </div>
                        <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${getProgress(totals.protein, targets.protein)}%` }}
                            />
                        </div>
                    </div>

                    {/* Carbs */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-green-700">Carbs</span>
                            <span className="text-green-500">{totals.carbs}/{targets.carbs}g</span>
                        </div>
                        <div className="h-1.5 bg-green-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${getProgress(totals.carbs, targets.carbs)}%` }}
                            />
                        </div>
                    </div>

                    {/* Fats */}
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-yellow-700">Fats</span>
                            <span className="text-yellow-500">{totals.fats}/{targets.fats}g</span>
                        </div>
                        <div className="h-1.5 bg-yellow-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ width: `${getProgress(totals.fats, targets.fats)}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
